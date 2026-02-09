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
import { getAllowedCompanyIds } from 'src/utils/resolveAllowedCompanyIds';
import { ActiveUser } from 'src/auth/decorators';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class LevelsResolver {
  constructor(private readonly levelsService: LevelsService) {}

  @Query('levels')
  async findAll(
    @ActiveUser() user: ActiveUserData,
  ): Promise<GraphQLTypes.Level[]> {
    const allowedCompanyIds = getAllowedCompanyIds(user);
    return this.levelsService.findAll(user, allowedCompanyIds);
  }

  @Roles([], [], 'level')
  @Query('level')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.findOne(id);
  }

  @Roles([Role.COMPANY_ADMIN, Role.SANDVIK_TECHNICIAN], [], 'level')
  @Mutation('createLevel')
  async create(
    @Args('createLevelInput')
    createLevelInput: CreateLevelInput,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.create(createLevelInput);
  }

  @Roles([Role.COMPANY_ADMIN, Role.SANDVIK_TECHNICIAN], [], 'level')
  @Mutation('updateLevel')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateLevelInput')
    updateLevelInput: UpdateLevelInput,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.update(id, updateLevelInput);
  }

  @Roles([Role.COMPANY_ADMIN, Role.SANDVIK_TECHNICIAN], [], 'level')
  @Mutation('removeLevel')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.remove(id);
  }
}
