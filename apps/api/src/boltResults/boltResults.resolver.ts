import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import * as GraphQLTypes from 'src/graphql-types';
import {
  BadRequestException,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { BoltResultsService } from './boltResults.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { BoltResultResponse } from './BoltResultResponse';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators';
import { ConfigService } from '@nestjs/config';
import { CreateBoltResultInput } from './dto/create-boltResult.input';
import { BoltResult } from '@prisma/client';
import { UpdateBoltResultInput } from './dto/update-boltResult.input';

import { ParseUUIDPipe } from '@nestjs/common';
import { BoltResultsService } from './boltResults.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Resolver()
@UseGuards(JwtGuard)
export class BoltResultsResolver {
  constructor(
    private readonly config: ConfigService,
    private readonly boltResultsService: BoltResultsService,
  ) {}

  @Query(() => BoltResultResponse, { name: 'boltResults' })
  async getBoltResults(
    @ActiveUser() user: ActiveUserData,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('siteId', { type: () => String, nullable: true }) siteId?: string,
    @Args('levelId', { type: () => String, nullable: true }) levelId?: string,
    @Args('driveId', { type: () => String, nullable: true }) driveId?: string,
    @Args('locationId', { type: () => String, nullable: true })
    locationId?: string,
    @Args('result', { type: () => String, nullable: true }) result?: string,
    @Args('isHazard', { type: () => Boolean, nullable: true })
    isHazard?: boolean,
  ): Promise<BoltResultResponse> {
    const pagination = {
      offset: Number(offset ?? this.config.get<number>('DEFAULT_SKIP') ?? 0),
      limit: Number(limit ?? this.config.get<number>('DEFAULT_TAKE') ?? 20),
    };
    const filters: Partial<Record<string, string | boolean>> = {
      siteId,
      levelId,
      driveId,
      locationId,
      result,
      isHazard,
    };

    return this.boltResultsService.getBoltResults(user, pagination, filters);
  }

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
    console.log(id, updateBoltResultInput);
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
