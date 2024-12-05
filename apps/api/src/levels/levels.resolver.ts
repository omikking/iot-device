import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LevelsService } from './levels.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateLevelInput } from './dto/create-level.input';
import { UpdateLevelInput } from './dto/update-level.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver()
export class LevelsResolver {
  constructor(private readonly levelsService: LevelsService) {}

  @Query('levels')
  async findAll(): Promise<GraphQLTypes.Level[]> {
    return this.levelsService.findAll();
  }

  @Query('level')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.findOne(id);
  }

  @Mutation('createLevel')
  async create(
    @Args('createLevelInput')
    createLevelInput: CreateLevelInput,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.create(createLevelInput);
  }

  @Mutation('updateLevel')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateLevelInput')
    updateLevelInput: UpdateLevelInput,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.update(id, updateLevelInput);
  }

  @Mutation('removeLevel')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.remove(id);
  }
}
