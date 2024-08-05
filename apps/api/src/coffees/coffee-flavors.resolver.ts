import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Coffee } from './interface/coffee-data';

@Resolver('Coffee') // This resolver targets the Coffee entity in our GraphQL schema
export class CoffeeFlavorsResolver {
  constructor(private prisma: PrismaService) {}

  // It is a resolver for the flavors field of the Coffee entity
  @ResolveField('flavors')
  // We can access the parent object (Coffee entity) using the @Parent() decorator
  async getFlavorsOfCoffee(@Parent() coffee: Coffee) {
    const flavors = await this.prisma.flavor.findMany({
      where: {
        coffees: {
          some: {
            coffeeId: coffee.id,
          },
        },
      },
    });

    return flavors;
  }
}
