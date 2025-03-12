import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateBoltResultInput } from './dto/create-boltResult.input';
import { UpdateBoltResultInput } from './dto/update-boltResult.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { BoltResultsService } from './boltResults.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { BoltResultResponse } from './BoltResultResponse';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators';
import { ConfigService } from '@nestjs/config';

@Resolver()
@UseGuards(JwtGuard)
export class BoltResultsResolver {
  constructor(
    private readonly config: ConfigService,
    private readonly boltResultsService: BoltResultsService,
  ) {}
  @Query(() => BoltResultResponse, { name: 'boltResults' })
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('siteId', { type: () => String, nullable: true }) siteId?: string,
    @Args('levelId', { type: () => String, nullable: true }) levelId?: string,
    @Args('driveId', { type: () => String, nullable: true }) driveId?: string,
    @Args('locationId', { type: () => String, nullable: true })
    locationId?: string,
    @Args('result', { type: () => String, nullable: true }) result?: string,
    @Args('isHazard', { type: () => Boolean, nullable: true })
    isHazard?: boolean,
  ): Promise<BoltResultResponse> {
    // Ensure defaults are properly converted to numbers
    const finalSkip = Number(
      skip ?? this.config.get<number>('DEFAULT_SKIP') ?? 0,
    );
    const finalTake = Number(
      take ?? this.config.get<number>('DEFAULT_TAKE') ?? 20,
    );
    const filters = { siteId, levelId, driveId, locationId, result, isHazard };
    return this.boltResultsService.findAll(user, finalSkip, finalTake, filters);
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
    return this.boltResultsService.update(id, updateBoltResultInput);
  }

  @Mutation('removeBoltResult')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.remove(id);
  }
}
