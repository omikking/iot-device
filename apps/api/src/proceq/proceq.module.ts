import { Module } from '@nestjs/common';
import { ProceqApiService } from './proceq-api.service';
import { ProceqAuthService } from './proceq-auth.service';
import { ProceqSchedulerService } from './proceq-scheduler.service';
import { ProceqSyncService } from './proceq-sync.service';
import { ProceqAuthController } from './proceq-auth.controller';
import { BansheeStatsModule } from '../banshee-stats/banshee-stats.module';
import { ProceqAuthResolver } from './proceq-auth.resolver';
import { BansheeOrderModule } from '../banshee-order/banshee-order.module';

@Module({
  imports: [BansheeStatsModule, BansheeOrderModule],
  providers: [
    ProceqApiService,
    ProceqAuthService,
    ProceqSchedulerService,
    ProceqSyncService,
    ProceqAuthResolver,
  ],
  controllers: [ProceqAuthController],
  exports: [ProceqApiService, ProceqAuthService],
})
export class ProceqModule {}
