import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import * as GraphQLTypes from 'src/graphql-types';
import { UpdateUserInput } from './dto/update-user.input';
import { ForbiddenException, ParseUUIDPipe } from '@nestjs/common';
import { GlobalRole } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ActiveUser } from 'src/auth/decorators';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { UpdatePasswordInput } from './dto/update-user-password.input';
import { getAllowedCompanyIds } from 'src/utils/resolveAllowedCompanyIds';

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
    const allowedCompanyIds = getAllowedCompanyIds(user);

    if (allowedCompanyIds.length === 0) {
      throw new ForbiddenException('You do not have permission to list users.');
    }

    return this.usersService.findAll(user, allowedCompanyIds, roles);
  }

  @Query('user')
  async findOne(
    @ActiveUser() user: ActiveUserData,
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.User> {
    if (user.globalRole !== GlobalRole.SANDVIK_ADMIN && user.id !== id) {
      throw new ForbiddenException('You can only access your own user data.');
    }
    return this.usersService.findOne(id);
  }

  @Mutation('updateUser')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
    @Args('updateUserInput')
    updateUserInput: UpdateUserInput,
    @Args('updatePasswordInput', { nullable: true })
    updatePasswordInput?: UpdatePasswordInput,
  ): Promise<GraphQLTypes.User> {
    if (user.globalRole !== GlobalRole.SANDVIK_ADMIN && user.id !== id) {
      throw new ForbiddenException('You can only update your own user data.');
    }
    return this.usersService.update(id, updateUserInput, updatePasswordInput);
  }

  @Mutation('removeUser')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ): Promise<GraphQLTypes.User> {
    if (user.globalRole !== GlobalRole.SANDVIK_ADMIN && user.id !== id) {
      throw new ForbiddenException('You can only remove your own user.');
    }
    return this.usersService.remove(id);
  }
}
