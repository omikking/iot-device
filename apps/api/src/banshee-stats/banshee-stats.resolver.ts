import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators';
import { getAllowedCompanyIds } from 'src/utils/resolveAllowedCompanyIds';
import { BansheeStatsService } from './banshee-stats.service';
import { Application } from '@prisma/client';

@Resolver()
@UseGuards(JwtGuard)
export class BansheeStatsResolver {
  constructor(
    private readonly statsService: BansheeStatsService,
  ) {}

  @Query('bansheeSessionStats')
  async bansheeSessionStats(
    @ActiveUser() user: ActiveUserData,
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
    @Args('companyId', { nullable: true }) companyId?: string,
    @Args('siteId', { nullable: true }) siteId?: string,
  ) {
    const allowedCompanyIds = getAllowedCompanyIds(user);
    const allowedApps = [Application.BANSHEE];

    return this.statsService.bansheeSessionStats(
      user,
      startDate,
      endDate,
      companyId,
      siteId,
      allowedCompanyIds,
      allowedApps,
    );
  }
}