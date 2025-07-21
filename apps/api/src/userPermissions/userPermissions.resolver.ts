import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserPermissionsService } from './userPermissions.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateUserPermissionInput } from './dto/create-userPermissions.input';
import { UpdateUserPermissionInput } from './dto/update-userPermissions.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RequireRoles } from 'src/auth/decorators/permission.decorator';
import { GlobalRole, Role } from '@prisma/client';
import { PermissionGuard } from 'src/auth/guard/permission.guard';

@Resolver()
@UseGuards(JwtGuard, PermissionGuard)
export class UserPermissionsResolver {
  constructor(
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  // TODO Not sure if RequiredRoles should be here.
  @RequireRoles(GlobalRole.SANDVIK_ADMIN)
  @Query('userPermissions')
  async findAll(): Promise<GraphQLTypes.UserPermission[]> {
    return this.userPermissionsService.findAll();
  }

  @Query('userPermission')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.findOne(id);
  }

  // @RequireCompanyAccess(true)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Mutation('createUserPermission')
  async create(
    @Args('createUserPermissionInput')
    createUserPermissionInput: CreateUserPermissionInput,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.create(createUserPermissionInput);
  }

  // @RequireCompanyAccess(true)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Mutation('updateUserPermission')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateUserPermissionInput')
    updateUserPermissionInput: UpdateUserPermissionInput,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.update(id, updateUserPermissionInput);
  }

  // @RequireCompanyAccess(true)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Mutation('removeUserPermission')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.remove(id);
  }
}
