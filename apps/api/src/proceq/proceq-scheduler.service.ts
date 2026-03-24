import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProceqSyncService } from './proceq-sync.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProceqSchedulerService {
  private readonly logger = new Logger(ProceqSchedulerService.name);

  constructor(
    private readonly syncService: ProceqSyncService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron('0 */5 * * * *')
  async handleProceqSync() {
    this.logger.debug('Triggered Proceq data synchronization');

    try {
      const tokens = await this.prisma.proceqToken.findMany({
        select: { operatorEmail: true },
      });

      if (tokens.length === 0) {
        this.logger.debug('No Proceq tokens found, skipping sync');
        return;
      }

      this.logger.log(`Starting sync for ${tokens.length} users`);

      for (const token of tokens) {
        try {
          const result = await this.syncService.syncAllMeasurements(
            token.operatorEmail,
          );

          if (result.success) {
            this.logger.log(
              `Proceq sync for ${token.operatorEmail} completed in ${result.duration}ms — scanned: ${result.totalScanned}, new: ${result.newMeasurements}`,
            );
          } else if (result.duration === 0) {
            this.logger.debug(
              `Proceq sync for ${token.operatorEmail} was skipped (already running)`,
            );
          }
        } catch (error) {
          this.logger.error(
            `Proceq sync failed for ${token.operatorEmail}`,
            error.stack || error.message,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        'Proceq data synchronization failed',
        error.stack || error.message,
      );
    }
  }
}
