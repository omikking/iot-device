import { ParseIntPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  async findAll(): Promise<GraphQLTypes.User[]> {
    return this.usersService.findAll();
  }

  @Query('user')
  async findOne(
    @Args('id', ParseIntPipe) id: number,
  ): Promise<GraphQLTypes.User> {
    return this.usersService.findOne(id);
  }

  @Mutation('createUser')
  async create(
    @Args('createUserInput')
    createUserInput: CreateUserInput,
  ): Promise<GraphQLTypes.User> {
    return this.usersService.create(createUserInput);
  }

  @Mutation('updateUser')
  async update(
    @Args('id', ParseIntPipe) id: number,
    @Args('updateUserInput')
    updateUserInput: UpdateUserInput,
  ): Promise<GraphQLTypes.User> {
    return this.usersService.update(id, updateUserInput);
  }

  @Mutation('removeUser')
  async remove(
    @Args('id', ParseIntPipe) id: number,
  ): Promise<GraphQLTypes.User> {
    return this.usersService.remove(id);
  }
}
