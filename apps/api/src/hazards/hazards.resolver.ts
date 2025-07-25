import { Args, Query, Resolver } from '@nestjs/graphql';
import { HazardsService } from './hazards.service';
import * as GraphQLTypes from 'src/graphql-types';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { getAllowedCompanyIds } from 'src/utils/resolveAllowedCompanyIds';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guard';

@Resolver()
@UseGuards(JwtGuard)
export class HazardsResolver {
  constructor(private readonly hazardsService: HazardsService) {}

  @Query('hazards')
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Args('companyId', ParseUUIDPipe) companyId: string,
  ): Promise<GraphQLTypes.BoltResult[]> {
    const allowedCompanyIds = getAllowedCompanyIds(user);
    return this.hazardsService.findAll(companyId, allowedCompanyIds);
  }
}
