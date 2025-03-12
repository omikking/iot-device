import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateBoltResultInput } from './dto/create-boltResult.input';
import { UpdateBoltResultInput } from './dto/update-boltResult.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { BoltResultsService } from './boltResults.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
// import { BoltResult } from '@prisma/client';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { BoltResultResponse } from './BoltResultResponse';
// import { BoltResultsResponse } from './boltResultsResponse';

@Resolver()
@UseGuards(JwtAuthGuard)
export class BoltResultsResolver {
  constructor(private readonly boltResultsService: BoltResultsService) {}

  @Query(() => BoltResultResponse, { name: 'boltResults' })
  async findAll(
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
    @ActiveUser() user: ActiveUserData,
    @Args('siteId', { type: () => String, nullable: true }) siteId?: string,
    @Args('levelId', { type: () => String, nullable: true }) levelId?: string,
    @Args('driveId', { type: () => String, nullable: true }) driveId?: string,
    @Args('locationId', { type: () => String, nullable: true })
    locationId?: string,
  ): Promise<BoltResultResponse> {
    const filters = { siteId, levelId, driveId, locationId };
    return this.boltResultsService.findAll(skip, take, user, filters);
  }

  // @Query(() => [GraphQLTypes.BoltResult], { name: 'boltResults' })
  // async findAll(
  //   @Args('skip', { type: () => Int, nullable: true }) skip = 0,
  //   @Args('take', { type: () => Int, nullable: true }) take = 10,
  //   @ActiveUser() user: ActiveUserData, // Extract user
  //   @Args('siteId', { type: () => String, nullable: true }) siteId?: string,
  //   @Args('levelId', { type: () => String, nullable: true }) levelId?: string,
  //   @Args('driveId', { type: () => String, nullable: true }) driveId?: string,
  //   @Args('locationId', { type: () => String, nullable: true })
  //   locationId?: string,
  // ): Promise<BoltResult[]> {
  //   const filters = { siteId, levelId, driveId, locationId };
  //   return this.boltResultsService.findAll(skip, take, user, filters);
  // }

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
}
