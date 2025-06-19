import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateBoltResultInput } from './dto/create-boltResult.input';
import { UpdateBoltResultInput } from './dto/update-boltResult.input';
import {
  UseGuards,
  BadRequestException,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';

import { BoltResultsService } from './boltResults.service';

import { JwtGuard } from '../auth/guard/jwt.guard';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators';
import { BoltResult, Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles-decorator';
import { App } from 'src/auth/decorators/app-decorator';
import { Application } from '@prisma/client';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class BoltResultsResolver {
  constructor(private readonly boltResultsService: BoltResultsService) {}

  @Query(() => GraphQLTypes.BoltResult, { name: 'boltResults' })
  async findMany(
    @ActiveUser() user: ActiveUserData,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('siteId', { type: () => String, nullable: true }) siteId?: string,
    @Args('levelId', { type: () => String, nullable: true }) levelId?: string,
    @Args('driveId', { type: () => String, nullable: true }) driveId?: string,
    @Args('locationId', { type: () => String, nullable: true })
    locationId?: string,
    @Args('result', { type: () => [String] }) result?: string[],
    @Args('isHazard', { type: () => Boolean, nullable: true })
    isHazard?: boolean,
    @Args('withComment', { type: () => Boolean, nullable: true })
    withComment?: boolean,
    @Args('withImage', { type: () => Boolean, nullable: true })
    withImage?: boolean,
    @Args('startDate', { type: () => Date })
    startDate?: Date,
    @Args('endDate', { type: () => Date })
    endDate?: Date,
  ): Promise<GraphQLTypes.BoltResultResponse> {
    const pagination: { offset: number; limit?: number } = {
      offset: Number(offset ?? 0),
      ...(limit !== undefined ? { limit: Number(limit) } : {}),
    };

    const filters = {
      siteId,
      levelId,
      driveId,
      locationId,
      result,
      isHazard,
      withImage,
      withComment,
      startDate,
      endDate,
    };
    return this.boltResultsService.findMany(user, pagination, filters);
  }

  @Roles(Role.COMPANY_USER, Role.SANDVIK_TECHNICIAN, Role.COMPANY_ADMIN)
  @App(Application.PULL_TEST)
  @Query('boltResult')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.findOne(id);
  }

  @Mutation('createBoltResult')
  async create(
    @Args('createBoltResultInput')
    createBoltResultInput: CreateBoltResultInput,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.create(createBoltResultInput);
  }

  @Mutation('updateBoltResult')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateBoltResultInput')
    updateBoltResultInput: UpdateBoltResultInput,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.update(id, updateBoltResultInput);
  }

  @Mutation('removeBoltResult')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.remove(id);
  }

  @Mutation('createBoltResults')
  async createBulk(
    @Args('createBoltResultsInput', new ValidationPipe({ transform: true }))
    createBoltResultsInput: CreateBoltResultInput[],
  ): Promise<BoltResult[]> {
    return this.boltResultsService.createBulk(createBoltResultsInput);
  }

  @Mutation('updateBoltResults')
  async updateBulk(
    @Args('updateBoltResultsInput', new ValidationPipe({ transform: true }))
    updateBoltResultsInput: UpdateBoltResultInput[],
  ): Promise<BoltResult[]> {
    if (!updateBoltResultsInput.length) {
      throw new BadRequestException('No updates provided.');
    }

    return this.boltResultsService.updateBulk(updateBoltResultsInput);
  }

  @Mutation('removeBoltResults')
  async removeBulk(
    @Args('ids', new ValidationPipe({ transform: true })) ids: string[],
  ): Promise<BoltResult[]> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('No IDs provided for deletion.');
    }
    return this.boltResultsService.removeBulk(ids);
  }
}
