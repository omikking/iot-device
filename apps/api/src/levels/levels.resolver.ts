import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LevelsService } from './levels.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateLevelInput } from './dto/create-level.input';
import { UpdateLevelInput } from './dto/update-level.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { PermissionGuard } from 'src/auth/guard/permission.guard';

@Resolver()
@UseGuards(JwtGuard, PermissionGuard)
export class LevelsResolver {
  constructor(private readonly levelsService: LevelsService) {}

  // TODO How do we handle restrictions here?

  // @RequireCompanyAccess(true)
  @Query('levels')
  async findAll(): Promise<GraphQLTypes.Level[]> {
    return this.levelsService.findAll();
  }

  // @RequireCompanyAccess(true)
  @Query('level')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.findOne(id);
  }

  // @RequireCompanyAccess(true)
  @Mutation('createLevel')
  async create(
    @Args('createLevelInput')
    createLevelInput: CreateLevelInput,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.create(createLevelInput);
  }

  // @RequireCompanyAccess(true)
  @Mutation('updateLevel')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateLevelInput')
    updateLevelInput: UpdateLevelInput,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.update(id, updateLevelInput);
  }

  // @RequireCompanyAccess(true)
  @Mutation('removeLevel')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.remove(id);
  }
}
