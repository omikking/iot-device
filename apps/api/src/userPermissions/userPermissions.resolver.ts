import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserPermissionsService } from './userPermissions.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateUserPermissionInput } from './dto/create-userPermissions.input';
import { UpdateUserPermissionInput } from './dto/update-userPermissions.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUser } from 'src/auth/decorators';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { getAllowedCompanyIds } from 'src/utils/resolveAllowedCompanyIds';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class UserPermissionsResolver {
  constructor(
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  @Query('userPermissions')
  async findAll(
    @ActiveUser() user: ActiveUserData,
  ): Promise<GraphQLTypes.UserPermission[]> {
    const allowedCompanyIds = getAllowedCompanyIds(user);
    return this.userPermissionsService.findAll(user, allowedCompanyIds);
  }

  @Roles([], [], 'userPermission')
  @Query('userPermission')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.findOne(id);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'userPermission')
  @Mutation('createUserPermission')
  async create(
    @Args('createUserPermissionInput')
    createUserPermissionInput: CreateUserPermissionInput,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.create(createUserPermissionInput);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'userPermission')
  @Mutation('updateUserPermission')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateUserPermissionInput')
    updateUserPermissionInput: UpdateUserPermissionInput,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.update(id, updateUserPermissionInput);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'userPermission')
  @Mutation('removeUserPermission')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.remove(id);
  }
}
