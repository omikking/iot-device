import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserPermissionsService } from './userPermissions.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateUserPermissionInput } from './dto/create-userPermissions.input';
import { UpdateUserPermissionInput } from './dto/update-userPermissions.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class UserPermissionsResolver {
  constructor(
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

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

  @Mutation('createUserPermission')
  async create(
    @Args('createUserPermissionInput')
    createUserPermissionInput: CreateUserPermissionInput,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.create(createUserPermissionInput);
  }

  @Mutation('updateUserPermission')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateUserPermissionInput')
    updateUserPermissionInput: UpdateUserPermissionInput,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.update(id, updateUserPermissionInput);
  }

  @Mutation('removeUserPermission')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.UserPermission> {
    return this.userPermissionsService.remove(id);
  }
}
