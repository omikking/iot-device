import { Module } from '@nestjs/common';
import { BansheeStatsService } from './banshee-stats.service';
import { BansheeStatsResolver } from './banshee-stats.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BansheeStatsService, BansheeStatsResolver],
  exports: [BansheeStatsService],
})
export class BansheeStatsModule {}
