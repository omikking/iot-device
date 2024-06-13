import { Injectable } from '@nestjs/common';
import * as GraphQLTypes from 'src/graphql-types';
import { UserInputError } from '@nestjs/apollo';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoffeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<GraphQLTypes.Coffee[]> {
    return this.prisma.coffee.findMany();
  }

  async findOne(id: number): Promise<GraphQLTypes.Coffee> {
    const coffee = await this.prisma.coffee.findUnique({ where: { id } });
    if (!coffee) {
      throw new UserInputError(`Coffee #${id} does not exist`);
    }
    return coffee;
  }

  async create(
    createCoffeeInput: GraphQLTypes.CreateCoffeeInput,
  ): Promise<GraphQLTypes.Coffee> {
    const newCoffee = await this.prisma.coffee.create({
      data: createCoffeeInput,
    });

    return newCoffee;
  }
}
