import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LevelsService } from './levels.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateLevelInput } from './dto/create-level.input';
import { UpdateLevelInput } from './dto/update-level.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { CompanyContextGuard } from 'src/auth/guard/company-context.guard';
import { RequireCompanyAccess } from 'src/auth/decorators/permission.decorator';
import { CompaniesAccessGuard } from 'src/auth/guard/companies-access.guard';

@Resolver()
@UseGuards(CompanyContextGuard, JwtGuard, PermissionGuard)
export class LevelsResolver {
  constructor(private readonly levelsService: LevelsService) {}

  // TODO what restrictions do we want here?
  // Should any role be able to create, update, delete or just company admins?
  @UseGuards(CompaniesAccessGuard)
  @Query('levels')
  async findAll(@Context() context: any): Promise<GraphQLTypes.Level[]> {
    return this.levelsService.findAll(
      context.allowedCompanyIds,
      context.isSandvikAdmin,
    );
  }

  @RequireCompanyAccess(true)
  @Query('level')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.findOne(id);
  }

  @RequireCompanyAccess(true)
  @Mutation('createLevel')
  async create(
    @Args('createLevelInput')
    createLevelInput: CreateLevelInput,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.create(createLevelInput);
  }

  @RequireCompanyAccess(true)
  @Mutation('updateLevel')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateLevelInput')
    updateLevelInput: UpdateLevelInput,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.update(id, updateLevelInput);
  }

  @RequireCompanyAccess(true)
  @Mutation('removeLevel')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Level> {
    return this.levelsService.remove(id);
  }
}
