import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import * as GraphQLTypes from 'src/graphql-types';
import { UpdateUserInput } from './dto/update-user.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { GlobalRole, Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UpdatePasswordInput } from './dto/update-user-password.input';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import {
  RequireCompanyAccess,
  RequireRoles,
} from 'src/auth/decorators/permission.decorator';
import { UserAccessGuard } from 'src/auth/guard/user-access.guard';

@Resolver()
@UseGuards(JwtGuard, PermissionGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // TODO Not sure if RequiredRoles should be here.
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Query('users')
  async findAll(
    @Args('roles', { type: () => [String], nullable: true })
    roles?: GlobalRole[],
  ): Promise<GraphQLTypes.User[]> {
    return this.usersService.findAll(roles);
  }

  // TODO Test if user access guard is working
  @UseGuards(UserAccessGuard)
  @Query('user')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.User> {
    return this.usersService.findOne(id);
  }

  @UseGuards(UserAccessGuard)
  @RequireCompanyAccess(true)
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

  @UseGuards(UserAccessGuard)
  @RequireCompanyAccess(true)
  @Mutation('removeUser')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.User> {
    return this.usersService.remove(id);
  }
}
