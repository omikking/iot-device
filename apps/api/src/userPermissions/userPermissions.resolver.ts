import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserPermissionsService } from './userPermissions.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateUserPermissionInput } from './dto/create-userPermissions.input';
import { UpdateUserPermissionInput } from './dto/update-userPermissions.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import {
  RequireCompanyAccess,
  RequireRoles,
} from 'src/auth/decorators/permission.decorator';
import { GlobalRole, Role } from '@prisma/client';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { CompaniesAccessGuard } from 'src/auth/guard/companies-access.guard';
import { CompanyContextGuard } from 'src/auth/guard/company-context.guard';

@Resolver()
@UseGuards(JwtGuard, CompanyContextGuard, PermissionGuard)
export class UserPermissionsResolver {
  constructor(
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  // TODO Not sure if CompaniesAccessGuard or RequiredRoles should be here.
  @UseGuards(CompaniesAccessGuard)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN)
  @Query('userPermissions')
  async findAll(
    @Context() context: any,
  ): Promise<GraphQLTypes.UserPermission[]> {
    return this.userPermissionsService.findAll(
      context.allowedCompanyIds,
      context.isSandvikAdmin,
    );
  }

  @RequireCompanyAccess(true)
  @Query('userPermission')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.findOne(id);
  }

  @RequireCompanyAccess(true)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Mutation('createUserPermission')
  async create(
    @Args('createUserPermissionInput')
    createUserPermissionInput: CreateUserPermissionInput,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.create(createUserPermissionInput);
  }

  @RequireCompanyAccess(true)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Mutation('updateUserPermission')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateUserPermissionInput')
    updateUserPermissionInput: UpdateUserPermissionInput,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.update(id, updateUserPermissionInput);
  }

  @RequireCompanyAccess(true)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Mutation('removeUserPermission')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.remove(id);
  }
}
