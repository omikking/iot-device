import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BansheeStatsService {
  private readonly logger = new Logger(BansheeStatsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async updateStatsForMeasurement(
    createdTimestamp: Date | null,
    hasReadings: boolean,
    hasLogs: boolean,
    comment: string ,
    companyId: string
  ): Promise<void> {
    try {
      if (!createdTimestamp) {
        this.logger.warn('Missing required fields for stats update');
        return;
      }

      const date = createdTimestamp;
      const sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      const isNotMeasurable = this.isCommentNotMeasurable(comment);
      const isBroken = this.isCommentBroken(comment);
      
      const isMeasured = hasReadings;
      
      const hasLogsFlag = hasLogs;
      
      if (companyId) {
        const companyExists = await this.prisma.company.findUnique({
          where: { id: companyId }
        });
        
        if (!companyExists) {
          this.logger.warn(`Company with ID ${companyId} does not exist, skipping stats update`);
          return;
        }
      }
      
      await this.prisma.bansheeSessionStats.upsert({
        where: {
          sessionDate: sessionDate
        },
        update: {
          totalMeasured: {
            increment: isMeasured ? 1 : 0
          },
          notMeasurable: {
            increment: (hasLogsFlag && isNotMeasurable) ? 1 : 0
          },
          broken: {
            increment: (hasLogsFlag && isBroken) ? 1 : 0
          },
          companyId: companyId || null
        },
        create: {
          sessionDate,
          totalMeasured: isMeasured ? 1 : 0,
          notMeasurable: (hasLogsFlag && isNotMeasurable) ? 1 : 0,
          broken: (hasLogsFlag && isBroken) ? 1 : 0,
          companyId: companyId || null
        }
      });

      this.logger.log(`Updated stats for ${sessionDate.toISOString().split('T')[0]}`);
    } catch (error) {
      this.logger.error('Failed to update banshee stats', error.message);
    }
  }

  async getStats(
    date: Date,
    companyId?: string,
  ): Promise<any[]> {
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    const where: any = {
      sessionDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (companyId) {
      where.companyId = companyId;
    }

    return await this.prisma.bansheeSessionStats.findMany({
      where,
      include: {
        company: true,
      },
      orderBy: {
        sessionDate: 'desc',
      },
    });
  }

  async getStatsForPeriod(
    startDate: Date,
    endDate: Date,
    companyId?: string,
  ): Promise<any[]> {
    const where: any = {
      sessionDate: {
        gte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
        lte: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59),
      },
    };

    if (companyId) {
      where.companyId = companyId;
    }

    return await this.prisma.bansheeSessionStats.findMany({
      where,
      include: {
        company: true,
      },
      orderBy: {
        sessionDate: 'desc',
      },
    });
  }

  private isCommentNotMeasurable(comment: string | null): boolean {
    if (!comment) return false;
    const lowerComment = comment.toLowerCase();
    return lowerComment.includes('not measurable') || 
           lowerComment.includes('cannot measure') ||
           lowerComment.includes('unable to measure');
  }

  private isCommentBroken(comment: string | null): boolean {
    if (!comment) return false;
    const lowerComment = comment.toLowerCase();
    return lowerComment.includes('broken') ||
           lowerComment.includes('damage') ||
           lowerComment.includes('fault') ||
           lowerComment.includes('defect') ||
           lowerComment.includes('temperature') && lowerComment.includes('error');
  }
}