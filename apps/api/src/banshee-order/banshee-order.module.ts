import { Module } from '@nestjs/common';
import { BansheeOrderService } from './banshee-order.service';
import { BansheeOrderResolver } from './banshee-order.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { BansheeCommmunicationModule } from '../banshee-communication/banshee-communication.module';

@Module({
  imports: [BansheeCommmunicationModule],
  providers: [BansheeOrderService, BansheeOrderResolver, PrismaService],
  exports: [BansheeOrderService],
})
export class BansheeOrderModule {}
