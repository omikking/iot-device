import { ParseIntPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as GraphQLTypes from 'src/graphql-types';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeInput } from './dto/create-coffee.input';
// import { UpdateCoffeeInput } from './dto/update-coffee.input';
// import type { Coffee } from '@prisma/client';
import type { Coffee } from './interface/coffee-data';

@Resolver()
export class CoffeesResolver {
  // Inject the CoffeesService
  constructor(private readonly coffeeService: CoffeesService) {}

  @Query('coffees')
  async findAll(): Promise<Coffee[]> {
    return this.coffeeService.findAll();
  }

  @Query('coffee')
  // ParseIntPipe is a built-in pipe that converts a string to an integer
  async findOne(@Args('id', ParseIntPipe) id: number): Promise<Coffee> {
    console.log('FROM RESOLVER id: ', id);
    return this.coffeeService.findOne(id);
  }

  @Mutation('createCoffee')
  async create(
    @Args('createCoffeeInput') /* 
     We can use the DTO class instead of the GraphQL type directly because the DTO class extends the GraphQL type and has the same properties. 
    This way, we can use the class to validate the input data.
    createCoffeeInput: GraphQLTypes.CreateCoffeeInput
    */
    createCoffeeInput: GraphQLTypes.CreateCoffeeInput,
  ): Promise<Coffee> {
    // all we do here is get the values

    return this.coffeeService.create(createCoffeeInput);
  }

  // @Mutation('updateCoffee')
  // async update(
  //   @Args('id', ParseIntPipe) id: number,
  //   @Args('updateCoffeeInput')
  //   updateCoffeeInput: UpdateCoffeeInput,
  // ): Promise<GraphQLTypes.UpdateCoffeeInput> {
  //   return this.coffeeService.update(id, updateCoffeeInput);
  // }

  // @Mutation('removeCoffee')
  // async remove(
  //   @Args('id', ParseIntPipe) id: number,
  // ): Promise<GraphQLTypes.Coffee> {
  //   return this.coffeeService.remove(id);
  // }
}
