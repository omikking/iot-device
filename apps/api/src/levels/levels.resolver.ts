import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LevelsService } from './levels.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateLevelInput } from './dto/create-level.input';
import { UpdateLevelInput } from './dto/update-level.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class LevelsResolver {
  constructor(private readonly levelsService: LevelsService) {}

  // Fix here
  @Query('levels')
  async findAll(): Promise<GraphQLTypes.Level[]> {
    return this.levelsService.findAll();
  }

  @Roles([], [], 'level')
  @Query(() => GraphQLTypes.Level, { name: 'level' })
  async findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.findOne(id);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'level')
  @Mutation('createLevel')
  async create(
    @Args('createLevelInput')
    createLevelInput: CreateLevelInput,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.create(createLevelInput);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'level')
  @Mutation('updateLevel')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateLevelInput')
    updateLevelInput: UpdateLevelInput,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.update(id, updateLevelInput);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'level')
  @Mutation('removeLevel')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.remove(id);
  }
}
