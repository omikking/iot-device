import { Args, Query, Resolver } from '@nestjs/graphql';
import { HazardsService } from './hazards.service';
import * as GraphQLTypes from 'src/graphql-types';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Application } from '@prisma/client';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { RequireApps } from 'src/auth/decorators/permission.decorator';
import { CompanyContextGuard } from 'src/auth/guard/company-context.guard';
import { RequireCompanyAccess } from 'src/auth/decorators/permission.decorator';

@Resolver()
@UseGuards(CompanyContextGuard, PermissionGuard)
export class HazardsResolver {
  constructor(private readonly hazardsService: HazardsService) {}

  // @TODO not sure if I should use CompaniesAccessGuard here or just RequireCompanyAccess. Test and change later.
  @RequireCompanyAccess(true)
  @RequireApps(Application.PULL_TEST)
  @Query('hazards')
  async findAll(
    @Args('companyId', ParseUUIDPipe) companyId: string,
  ): Promise<GraphQLTypes.BoltResult[]> {
    return this.hazardsService.findAll(companyId);
  }
}
