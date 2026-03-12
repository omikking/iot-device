import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { BansheeStatsService } from './banshee-stats.service';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class BansheeStatsResolver {
  constructor(
    private readonly statsService: BansheeStatsService,
  ) {}

  @Query('getStats')
  async getStats(
    @Args('date') date: Date,
    @Args('companyId', { nullable: true }) companyId?: string,
  ) {
    return this.statsService.getStats(date, companyId);
  }

  @Query('statsForPeriod')
  async getStatsForPeriod(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
    @Args('companyId', { nullable: true }) companyId?: string,
  ) {
    return this.statsService.getStatsForPeriod(startDate, endDate, companyId);
  }

}
