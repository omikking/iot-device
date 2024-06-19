import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import * as GraphQLTypes from '../graphql-types';

@Resolver('Drink')
export class DrinksResolver {
  @Query('drinks')
  async findAll(): Promise<GraphQLTypes.Drink[]> {
    const coffee = new GraphQLTypes.Coffee();
    coffee.id = 1;
    coffee.name = 'Colombia';
    coffee.brand = 'Black Crow Coffee';

    const tea = new GraphQLTypes.Tea();
    tea.name = 'Lipton';

    return [tea, coffee];
  }

  @ResolveField()
  __resolveType(value: GraphQLTypes.Drink) {
    if ('brand' in value) {
      return 'Coffee';
    }
    return 'Tea';
  }
}
