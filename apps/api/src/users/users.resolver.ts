import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import * as GraphQLTypes from 'src/graphql-types';
import { UpdateUserInput } from './dto/update-user.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { GlobalRole } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ActiveUser } from 'src/auth/decorators';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { UpdatePasswordInput } from './dto/update-user-password.input';

@Resolver()
@UseGuards(JwtGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // TODO Fix all of here
  @Query('users')
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Args('roles', { type: () => [String], nullable: true })
    roles?: GlobalRole[],
  ): Promise<GraphQLTypes.User[]> {
    console.log('Authenticated User ', user);
    return this.usersService.findAll(roles);
  }

  @Query('user')
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
    @Args('updatePasswordInput', { nullable: true })
    updatePasswordInput?: UpdatePasswordInput,
  ): Promise<GraphQLTypes.User> {
    return this.usersService.update(id, updateUserInput, updatePasswordInput);
  }

  @Mutation('removeUser')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.User> {
    return this.usersService.remove(id);
  }
}
