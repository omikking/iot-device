import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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

  @Query('dailyStats')
  async getDailyStats(
    @Args('operatorEmail') operatorEmail: string,
    @Args('date') date: Date,
  ) {
    return this.statsService.getDailyStats(operatorEmail, date);
  }

  @Query('statsForPeriod')
  async getStatsForPeriod(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
    @Args('operatorEmail', { nullable: true }) operatorEmail?: string,
  ) {
    return this.statsService.getStatsForPeriod(startDate, endDate, operatorEmail);
  }

  @Query('dailyReport')
  async getDailyReport(
    @Args('date') date: Date,
  ) {
    return this.statsService.generateDailyReport(date);
  }

  @Mutation('generateDailyReport')
  async generateDailyReport(
    @Args('date') date: Date,
  ) {
    const report = await this.statsService.generateDailyReport(date);
    return `Generated report for ${date.toISOString().split('T')[0]} with ${report.length} entries`;
  }
}