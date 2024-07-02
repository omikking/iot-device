import { Module } from '@nestjs/common';
import { CoffeesResolver } from './coffees.resolver';
import { CoffeesService } from './coffees.service';
import { CoffeeFlavorsResolver } from './coffee-flavors.resolver';
import { DateScalar } from 'src/common/scalars/date.scalar';

@Module({
  providers: [
    CoffeesResolver,
    CoffeesService,
    CoffeeFlavorsResolver,
    DateScalar,
  ],
})
export class CoffeesModule {}
