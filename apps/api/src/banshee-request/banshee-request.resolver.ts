import {
  Args,
  Mutation,
  Query,
  Resolver,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import * as GraphQLTypes from '../graphql-types';
import { CreateBansheeRequestInput } from './dto/create-banshee-request.input';
import { UpdateBansheeRequestInput } from './dto/update-banshee-request.input';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';

import { JwtGuard } from '../auth/guard/jwt.guard';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { BansheeRequestsService } from './banshee-request.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Application, BoltType, GlobalRole } from '@prisma/client';
import { getAllowedCompanyIds } from 'src/utils/resolveAllowedCompanyIds';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver('BansheeRequest')
@UseGuards(JwtGuard, RolesGuard)
export class BansheeRequestsResolver {
  constructor(
    private readonly bansheeRequestsService: BansheeRequestsService,
    private readonly prisma: PrismaService,
  ) {}

  @Roles([], [Application.BANSHEE], 'bansheeRequest')
  @Mutation('createBansheeRequest')
  async create(
    @Args('createBansheeRequestInput')
    createBansheeRequestInput: CreateBansheeRequestInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.bansheeRequestsService.create(createBansheeRequestInput, user);
  }

  @Roles([], [Application.BANSHEE], 'bansheeRequest')
  @Mutation('updateBansheeRequest')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateBansheeRequestInput')
    updateBansheeRequestInput: UpdateBansheeRequestInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.bansheeRequestsService.update(
      id,
      updateBansheeRequestInput,
      user,
    );
  }

  @Roles([], [Application.BANSHEE], 'bansheeRequest')
  @Mutation('deleteBansheeRequest')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.bansheeRequestsService.remove(id, user);
  }

  @Query(() => GraphQLTypes.BansheeRequestResponse, { name: 'bansheeRequests' })
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('serialNumber', { nullable: true }) serialNumber?: string,
    @Args('measured', { nullable: true }) measured?: boolean,
    @Args('levelId', { nullable: true }) levelId?: string,
    @Args('period', { nullable: true }) period?: number,
    @Args('driveId', { nullable: true }) driveId?: string,
    @Args('locationId', { nullable: true }) locationId?: string,
    @Args('createdBy', { nullable: true }) createdBy?: string,
    @Args('companyId', { nullable: true }) companyId?: string,
    @Args('siteId', { nullable: true }) siteId?: string,
    @Args('activateNotifications', { nullable: true })
    activateNotifications?: boolean,
    @Args('startDate', { type: () => Date, nullable: true }) startDate?: Date,
    @Args('endDate', { type: () => Date, nullable: true }) endDate?: Date,
    @Args('isBrokenBolt', { nullable: true }) isBrokenBolt?: boolean,
    @Args('isNotMeasurable', { nullable: true }) isNotMeasurable?: boolean,
  ) {
    const allowedApps = [Application.BANSHEE];
    const allowedCompanyIds = getAllowedCompanyIds(user);

    return this.bansheeRequestsService.findAll(
      {
        offset,
        limit,
        serialNumber,
        measured,
        levelId,
        period,
        driveId,
        locationId,
        createdBy,
        companyId,
        siteId,
        activateNotifications,
        startDate,
        endDate,
        isBrokenBolt,
        isNotMeasurable,
      },
      allowedCompanyIds,
      allowedApps,
      user,
    );
  }

  @Roles([], [Application.BANSHEE], 'bansheeRequest')
  @Query('bansheeRequest')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.bansheeRequestsService.findOne(id, user);
  }

  @Query('bansheeStatusDistribution')
  async getStatusDistribution(
    @ActiveUser() user: ActiveUserData,
    @Args('companyId', { nullable: true }) companyId?: string,
    @Args('siteId', { nullable: true }) siteId?: string,
    @Args('locationId', { nullable: true }) locationId?: string,
    @Args('startDate', { type: () => Date, nullable: true }) startDate?: Date,
    @Args('endDate', { type: () => Date, nullable: true }) endDate?: Date,
  ) {
    const allowedApps = [Application.BANSHEE];
    const allowedCompanyIds = getAllowedCompanyIds(user);

    return this.bansheeRequestsService.getStatusDistribution(
      { companyId, siteId, locationId, startDate, endDate },
      allowedCompanyIds,
      user,
      allowedApps,
    );
  }

  @Query('bansheeEventLogs')
  async bansheeEventLogs(
    @ActiveUser() user: ActiveUserData,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('companyId', { nullable: true }) companyId?: string,
    @Args('siteId', { nullable: true }) siteId?: string,
  ) {
    const allowedApps = [Application.BANSHEE];
    const allowedCompanyIds = getAllowedCompanyIds(user);

    return this.bansheeRequestsService.getEventLogs(
      { offset, limit, companyId, siteId },
      allowedCompanyIds,
      user,
      allowedApps,
    );
  }

  @ResolveField()
  async level(@Parent() bansheeRequest: GraphQLTypes.BansheeRequest) {
    if (!bansheeRequest.levelId) return null;
    return this.prisma.level.findUnique({
      where: { id: bansheeRequest.levelId },
    });
  }

  @ResolveField()
  async drive(@Parent() bansheeRequest: GraphQLTypes.BansheeRequest) {
    if (!bansheeRequest.driveId) return null;
    return this.prisma.drive.findUnique({
      where: { id: bansheeRequest.driveId },
    });
  }

  @ResolveField()
  async location(@Parent() bansheeRequest: GraphQLTypes.BansheeRequest) {
    if (!bansheeRequest.locationId) return null;
    return this.prisma.location.findUnique({
      where: { id: bansheeRequest.locationId },
    });
  }

  @ResolveField()
  async company(@Parent() bansheeRequest: GraphQLTypes.BansheeRequest) {
    if (!bansheeRequest.companyId) return null;
    return this.prisma.company.findUnique({
      where: { id: bansheeRequest.companyId },
    });
  }

  @ResolveField()
  async site(@Parent() bansheeRequest: GraphQLTypes.BansheeRequest) {
    if (!bansheeRequest.siteId) return null;
    return this.prisma.site.findUnique({
      where: { id: bansheeRequest.siteId },
    });
  }

  @ResolveField()
  async proceqData(@Parent() bansheeRequest: GraphQLTypes.BansheeRequest) {
    return this.prisma.proceqData.findMany({
      where: { bansheeRequestId: bansheeRequest.id },
      include: { readings: true },
    });
  }

  @ResolveField()
  async eventLogs(@Parent() bansheeRequest: GraphQLTypes.BansheeRequest) {
    return this.prisma.bansheeEventLog.findMany({
      where: { bansheeRequestId: bansheeRequest.id },
    });
  }
  @ResolveField()
  async boltTypeConstant(
    @Parent() bansheeRequest: GraphQLTypes.BansheeRequest,
  ) {
    if (!bansheeRequest.boltType) return null;
    return this.prisma.bansheeBoltTypeConstant.findFirst({
      where: { boltType: bansheeRequest.boltType as BoltType },
    });
  }
  @ResolveField()
  async createdByUser(
    @Parent() bansheeRequest: GraphQLTypes.BansheeRequest,
    @ActiveUser() user: ActiveUserData,
  ) {
    if (!bansheeRequest.createdBy) return null;

    if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
      const hasAccess = await this.prisma.userPermission.findFirst({
        where: {
          userId: user.id,
          companyId: bansheeRequest.companyId,
        },
      });
      if (!hasAccess) return null;
    }

    return this.prisma.user.findUnique({
      where: { id: bansheeRequest.createdBy },
    });
  }
}
