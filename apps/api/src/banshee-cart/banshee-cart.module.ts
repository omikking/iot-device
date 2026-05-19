import { Module } from '@nestjs/common';
import { BansheeCartService } from './banshee-cart.service';
import { BansheeCartResolver } from './banshee-cart.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [BansheeCartService, BansheeCartResolver, PrismaService],
})
export class BansheeCartModule {}
