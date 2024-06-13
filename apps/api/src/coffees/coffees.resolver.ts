import { ParseIntPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { Coffee, CreateCoffeeInput } from 'src/graphql-types';
import * as GraphQLTypes from 'src/graphql-types';
import { CoffeesService } from './coffees.service';

@Resolver()
export class CoffeesResolver {
  // Inject the CoffeesService
  constructor(private readonly coffeeService: CoffeesService) {}

  @Query('coffees')
  async findAll(): Promise<GraphQLTypes.Coffee[]> {
    return this.coffeeService.findAll();
  }

  @Query('coffee')
  // ParseIntPipe is a built-in pipe that converts a string to an integer
  async findOne(
    @Args('id', ParseIntPipe) id: number,
  ): Promise<GraphQLTypes.Coffee | null> {
    console.log('FROM RESOLVER id: ', id);
    return this.coffeeService.findOne(id);
  }

  @Mutation('createCoffee')
  async create(
    @Args('createCoffeeInput')
    createCoffeeInput: GraphQLTypes.CreateCoffeeInput,
  ): Promise<GraphQLTypes.Coffee | null> {
    // all we do here is get the values
    console.log('FROM RESOLVER createCoffeeInput: ', createCoffeeInput);
    return this.coffeeService.create(createCoffeeInput);
  }
}
