import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateBansheeRequestInput } from './dto/create-banshee-request.input';
import { UpdateBansheeRequestInput } from './dto/update-banshee-request.input';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';

import { JwtGuard } from '../auth/guard/jwt.guard';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { BansheeRequestsService } from './banshee-request.service';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class BansheeRequestsResolver {
  constructor(
    private readonly bansheeRequestsService: BansheeRequestsService,
  ) {}

  @Mutation('createBansheeRequest')
  async create(
    @Args('createBansheeRequestInput')
    createBansheeRequestInput: CreateBansheeRequestInput,
    @ActiveUser() user: ActiveUserData,
  ): Promise<GraphQLTypes.BansheeRequest> {
    return this.bansheeRequestsService.create(createBansheeRequestInput, user);
  }

  @Mutation('updateBansheeRequest')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateBansheeRequestInput')
    updateBansheeRequestInput: UpdateBansheeRequestInput,
    @ActiveUser() user: ActiveUserData,
  ): Promise<GraphQLTypes.BansheeRequest> {
    return this.bansheeRequestsService.update(
      id,
      updateBansheeRequestInput,
      user,
    );
  }

  @Mutation('deleteBansheeRequest')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.BansheeRequest> {
    return this.bansheeRequestsService.remove(id);
  }

  @Query('bansheeRequests')
  async findAll(
    @Args('offset', { nullable: true }) offset?: number,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('serialNumber', { nullable: true }) serialNumber?: string,
    @Args('measured', { nullable: true }) measured?: boolean,
    @Args('levelId', { nullable: true }) levelId?: string,
    @Args('period', { nullable: true }) period?: number,
    @Args('driveId', { nullable: true }) driveId?: string,
    @Args('locationId', { nullable: true }) locationId?: string,
    @Args('createdBy', { nullable: true }) createdBy?: string,
  ): Promise<GraphQLTypes.BansheeRequestResponse> {
    return this.bansheeRequestsService.findAll({
      offset,
      limit,
      serialNumber,
      measured,
      levelId,
      period,
      driveId,
      locationId,
      createdBy,
    });
  }

  @Query('bansheeRequest')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.BansheeRequest> {
    return this.bansheeRequestsService.findOne(id);
  }
}
