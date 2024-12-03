import { Module } from '@nestjs/common';
import { CoffeesResolver } from './coffees.resolver';
import { CoffeesService } from './coffees.service';
import { CoffeeFlavorsResolver } from './coffee-flavors.resolver';

@Module({
  providers: [CoffeesResolver, CoffeesService, CoffeeFlavorsResolver],
})
export class CoffeesModule {}
