import { Module } from '@nestjs/common';
import { BansheeOrderService } from './banshee-order.service';
import { BansheeOrderResolver } from './banshee-order.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [BansheeOrderService, BansheeOrderResolver, PrismaService],
  exports: [BansheeOrderService],
})
export class BansheeOrderModule {}
