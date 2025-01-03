import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import * as GraphQLTypes from 'src/graphql-types';
import { UpdateUserInput } from './dto/update-user.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  async findAll(): Promise<GraphQLTypes.User[]> {
    return this.usersService.findAll();
  }

  @Query('user')
  // @TODO if we decide to go back using number instead of string for id change to ParseIntPipe
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.User> {
    return this.usersService.findOne(id);
  }

  @Mutation('updateUser')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateUserInput')
    updateUserInput: UpdateUserInput,
  ): Promise<GraphQLTypes.User> {
    return this.usersService.update(id, updateUserInput);
  }

  @Mutation('removeUser')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.User> {
    return this.usersService.remove(id);
  }
}
