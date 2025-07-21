import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { HazardsService } from './hazards.service';
import * as GraphQLTypes from 'src/graphql-types';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Application } from '@prisma/client';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { RequireApps } from 'src/auth/decorators/permission.decorator';
import { CompanyContextGuard } from 'src/auth/guard/company-context.guard';
import { JwtGuard } from 'src/auth/guard';
import { CompaniesAccessGuard } from 'src/auth/guard/companies-access.guard';

@Resolver()
@UseGuards(JwtGuard, CompanyContextGuard, CompaniesAccessGuard, PermissionGuard)
export class HazardsResolver {
  constructor(private readonly hazardsService: HazardsService) {}

  @RequireApps(Application.PULL_TEST)
  @Query('hazards')
  async findAll(
    @Context() context: any,
    @Args('companyId', ParseUUIDPipe) companyId: string,
  ): Promise<GraphQLTypes.BoltResult[]> {
    return this.hazardsService.findAll(
      context.allowedCompanyIds,
      context.isSandvikAdmin,
      companyId,
    );
  }
}
