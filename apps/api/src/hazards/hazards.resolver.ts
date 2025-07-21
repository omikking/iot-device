import { Args, Query, Resolver } from '@nestjs/graphql';
import { HazardsService } from './hazards.service';
import * as GraphQLTypes from 'src/graphql-types';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Application } from '@prisma/client';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { RequireApps } from 'src/auth/decorators/permission.decorator';

@Resolver()
@UseGuards(PermissionGuard)
export class HazardsResolver {
  constructor(private readonly hazardsService: HazardsService) {}

  // TODO Need to check how to handle require company access

  // @RequireCompanyAccess(true)
  @RequireApps(Application.PULL_TEST)
  @Query('hazards')
  async findAll(
    @Args('companyId', ParseUUIDPipe) companyId: string,
  ): Promise<GraphQLTypes.BoltResult[]> {
    return this.hazardsService.findAll(companyId);
  }
}
