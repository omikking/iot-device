import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import * as GraphQLTypes from 'src/graphql-types';
import { UpdateUserInput } from './dto/update-user.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { GlobalRole, Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ActiveUser } from 'src/auth/decorators';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles-decorator';
import { UpdatePasswordInput } from './dto/update-user-password.input';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Args('roles', { type: () => [String], nullable: true })
    roles?: GlobalRole[],
  ): Promise<GraphQLTypes.User[]> {
    console.log('Authenticated User ', user);
    return this.usersService.findAll(roles);
  }

  @Roles(Role.COMPANY_ADMIN, Role.SANDVIK_ADMIN)
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
