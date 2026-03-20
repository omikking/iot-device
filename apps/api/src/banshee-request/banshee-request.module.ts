import { Module } from '@nestjs/common';
import { BansheeRequestsService } from './banshee-request.service';
import { BansheeRequestsResolver } from './banshee-request.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { BansheeStatsModule } from 'src/banshee-stats/banshee-stats.module';

@Module({
  imports: [BansheeStatsModule],
  providers: [BansheeRequestsService, BansheeRequestsResolver, PrismaService],
})
export class BansheeRequestModule {}
