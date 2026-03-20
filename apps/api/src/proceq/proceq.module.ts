import { Module } from '@nestjs/common';
import { ProceqApiService } from './proceq-api.service';
import { ProceqAuthService } from './proceq-auth.service';
import { ProceqSchedulerService } from './proceq-scheduler.service';
import { ProceqSyncService } from './proceq-sync.service';
import { ProceqAuthController } from './proceq-auth.controller';
import { BansheeStatsModule } from '../banshee-stats/banshee-stats.module';

@Module({
  imports: [BansheeStatsModule],
  providers: [
    ProceqApiService,
    ProceqAuthService,
    ProceqSchedulerService,
    ProceqSyncService,
  ],
  controllers: [ProceqAuthController],
  exports: [ProceqApiService, ProceqAuthService],
})
export class ProceqModule {}
