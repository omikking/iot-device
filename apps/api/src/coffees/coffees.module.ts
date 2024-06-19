import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoffeesResolver } from './coffees.resolver';
import { CoffeesService } from './coffees.service';
import { CoffeeFlavorsResolver } from './coffee-flavors.resolver';
import { DateScalar } from 'src/common/scalars/date.scalar';

@Module({
  providers: [
    CoffeesResolver,
    CoffeesService,
    PrismaService,
    CoffeeFlavorsResolver,
    DateScalar,
  ],
  exports: [PrismaService],
})
export class CoffeesModule {}
