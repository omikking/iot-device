import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoffeesResolver } from './coffees.resolver';
import { CoffeesService } from './coffees.service';

@Module({
  providers: [CoffeesResolver, CoffeesService, PrismaService],
  exports: [PrismaService],
})
export class CoffeesModule {}
