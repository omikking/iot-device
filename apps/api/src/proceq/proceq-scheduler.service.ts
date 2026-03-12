import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProceqSyncService } from './proceq-sync.service';

@Injectable()
export class ProceqSchedulerService {
  private readonly logger = new Logger(ProceqSchedulerService.name);

  constructor(private readonly syncService: ProceqSyncService) {}

  @Cron('0 */2 * * * *')
  async handleProceqSync() {
    this.logger.debug('Triggered Proceq data synchronization');
    try {
      const result = await this.syncService.syncAllMeasurements();

      if (result.success) {
        this.logger.log(
          `Proceq sync completed in ${result.duration}ms — scanned: ${result.totalScanned}, new: ${result.newMeasurements}`,
        );
      } else if (result.duration === 0) {
        this.logger.debug('Proceq sync was skipped (already running)');
        return;
      }
    } catch (error) {
      this.logger.error('Proceq data synchronization failed', error.stack || error.message);
    }
  }
}
