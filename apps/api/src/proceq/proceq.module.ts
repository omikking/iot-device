import { Module } from '@nestjs/common';
import { ProceqApiService } from './proceq-api.service';
import { ProceqAuthService } from './proceq-auth.service';
import { ProceqSchedulerService } from './proceq-scheduler.service';
import { ProceqSyncService } from './proceq-sync.service';
import { ProceqAuthController } from './proceq-auth.controller';
import { BansheeStatsModule } from '../banshee-stats/banshee-stats.module';
import { ProceqAuthResolver } from './proceq-auth.resolver';
import { BansheeOrderModule } from '../banshee-order/banshee-order.module';
import { BansheeCommmunicationModule } from '../banshee-communication/banshee-communication.module';
import { ProceqSyncConfigService } from './sync/proceq-sync.config';
import { TechnicianSyncLock } from './sync/technician-sync-lock';
import { TimestampComparator } from './sync/timestamp-comparator';
import { WindowedRunner } from './sync/windowed-runner';
import { ProceqNotificationDispatcher } from './sync/proceq-notification-dispatcher.service';

@Module({
  imports: [
    BansheeStatsModule,
    BansheeOrderModule,
    BansheeCommmunicationModule,
  ],
  providers: [
    ProceqApiService,
    ProceqAuthService,
    ProceqSchedulerService,
    ProceqSyncService,
    ProceqAuthResolver,
    // Multi-technician windowed sync collaborators (see ./sync).
    ProceqSyncConfigService,
    TechnicianSyncLock,
    TimestampComparator,
    WindowedRunner,
    ProceqNotificationDispatcher,
  ],
  controllers: [ProceqAuthController],
  exports: [ProceqApiService, ProceqAuthService],
})
export class ProceqModule {}
