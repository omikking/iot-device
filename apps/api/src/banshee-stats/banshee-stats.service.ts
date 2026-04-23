import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { BansheeSessionStats, GlobalRole, Application } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { hasAppAccessForCompany } from 'src/utils/resolveHasAppAccess';

type StatsOperation = 'create' | 'delete';
@Injectable()
export class BansheeStatsService {
  private readonly logger = new Logger(BansheeStatsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async updateStatsForMeasurement(
    createdTimestamp: Date | null,
    hasReadings: boolean,
    hasLogs: boolean,
    comment: string,
    siteId: string,
    companyId: string,
    operation: StatsOperation = 'create',
  ): Promise<void> {
    const delta = operation === 'create' ? 1 : -1;
    try {
      if (!createdTimestamp) {
        this.logger.warn('Missing required fields for stats update');
        return;
      }

      const date = createdTimestamp;
      const sessionDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );

      const isNotMeasurable = this.isCommentNotMeasurable(comment);
      const isBroken = this.isCommentBroken(comment);

      const isMeasured = hasReadings;

      const hasLogsFlag = hasLogs;

      if (companyId) {
        const companyExists = await this.prisma.company.findUnique({
          where: { id: companyId },
        });

        if (!companyExists) {
          this.logger.warn(
            `Company with ID ${companyId} does not exist, skipping stats update`,
          );
          return;
        }
      }

      if (operation === 'delete') {
        const currentStats = await this.prisma.bansheeSessionStats.findUnique({
          where: {
            companyId_siteId_sessionDate: {
              companyId: companyId,
              siteId: siteId,
              sessionDate: sessionDate,
            },
          },
        });

        if (!currentStats) {
          this.logger.warn(
            `No stats found for date ${sessionDate.toISOString().split('T')[0]}, skipping decrement`,
          );
          return;
        }
        const newTotalMeasured = Math.max(
          0,
          currentStats.totalMeasured + (isMeasured ? delta : 0),
        );
        const newNotMeasurable = Math.max(
          0,
          currentStats.notMeasurable +
            (hasLogsFlag && isNotMeasurable ? delta : 0),
        );
        const newBroken = Math.max(
          0,
          currentStats.broken + (hasLogsFlag && isBroken ? delta : 0),
        );

        await this.prisma.bansheeSessionStats.update({
          where: {
            companyId_siteId_sessionDate: {
              companyId: companyId,
              siteId: siteId,
              sessionDate: sessionDate,
            },
          },
          data: {
            totalMeasured: newTotalMeasured,
            notMeasurable: newNotMeasurable,
            broken: newBroken,
          },
        });
      } else {
        await this.prisma.bansheeSessionStats.upsert({
          where: {
            companyId_siteId_sessionDate: {
              companyId: companyId,
              siteId: siteId,
              sessionDate: sessionDate,
            },
          },
          update: {
            totalMeasured: {
              increment: isMeasured ? 1 : 0,
            },
            notMeasurable: {
              increment: hasLogsFlag && isNotMeasurable ? 1 : 0,
            },
            broken: {
              increment: hasLogsFlag && isBroken ? 1 : 0,
            },
          },
          create: {
            sessionDate,
            totalMeasured: isMeasured ? 1 : 0,
            notMeasurable: hasLogsFlag && isNotMeasurable ? 1 : 0,
            broken: hasLogsFlag && isBroken ? 1 : 0,
            companyId: companyId || null,
            siteId: siteId || null,
          },
        });
      }

      this.logger.log(
        `Updated stats for ${sessionDate.toISOString().split('T')[0]} (${operation})`,
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Failed to update banshee stats', error.message);
      } else {
        this.logger.error('Failed to update banshee stats', error);
      }
    }
  }

  async bansheeSessionStats(
    user: ActiveUserData,
    startDate: Date,
    endDate: Date,
    companyId: string | undefined,
    siteId: string | undefined,
    allowedCompanyIds: string[],
    allowedApps: Application[],
  ): Promise<BansheeSessionStats[]> {
    await this.validateUserCompanyAccess(
      user,
      companyId,
      allowedCompanyIds,
      allowedApps,
    );
    const where: any = {
      sessionDate: {
        gte: new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
        ),
        lte: new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          23,
          59,
          59,
        ),
      },
    };

    if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
      where.companyId = { in: allowedCompanyIds };
    }

    if (companyId) {
      where.companyId = companyId;
    }
    if (siteId) {
      where.siteId = siteId;
    }
    return await this.prisma.bansheeSessionStats.findMany({
      where,
      include: {
        company: true,
        site: true,
      },
      orderBy: {
        sessionDate: 'desc',
      },
    });
  }

  private async validateUserCompanyAccess(
    user: ActiveUserData,
    companyId: string | undefined,
    allowedCompanyIds: string[],
    allowedApps: Application[],
  ): Promise<void> {
    if (user.globalRole === GlobalRole.SANDVIK_ADMIN) {
      return;
    }

    if (allowedCompanyIds.length === 0) {
      throw new ForbiddenException('User does not have access to any company.');
    }

    if (companyId) {
      if (!allowedCompanyIds.includes(companyId)) {
        throw new ForbiddenException(
          'User does not have access to this company.',
        );
      }

      const hasAccess = await hasAppAccessForCompany(
        this.prisma,
        user,
        allowedApps,
        companyId,
      );

      if (!hasAccess) {
        throw new ForbiddenException(
          'Company does not have a valid BANSHEE plan.',
        );
      }
    } else {
      let hasAnyBansheeAccess = false;
      for (const allowedCompanyId of allowedCompanyIds) {
        const hasAccess = await hasAppAccessForCompany(
          this.prisma,
          user,
          allowedApps,
          allowedCompanyId,
        );

        if (hasAccess) {
          hasAnyBansheeAccess = true;
          this.logger.log(
            `User has BANSHEE access in company: ${allowedCompanyId}`,
          );
          break;
        }
      }

      if (!hasAnyBansheeAccess) {
        throw new ForbiddenException(
          'User does not have BANSHEE access in any company.',
        );
      }
    }
  }

  private isCommentNotMeasurable(comment: string | null): boolean {
    if (!comment) return false;
    const lowerComment = comment.toLowerCase();
    return (
      lowerComment.includes('not measurable') ||
      lowerComment.includes('cannot measure') ||
      lowerComment.includes('unable to measure')
    );
  }

  private isCommentBroken(comment: string | null): boolean {
    if (!comment) return false;
    const lowerComment = comment.toLowerCase();
    return (
      lowerComment.includes('broken') ||
      lowerComment.includes('damage') ||
      lowerComment.includes('fault') ||
      lowerComment.includes('defect') ||
      (lowerComment.includes('temperature') && lowerComment.includes('error'))
    );
  }
}
