import { Args, Query, Resolver } from '@nestjs/graphql';
import { HazardsService } from './hazards.service';
import * as GraphQLTypes from 'src/graphql-types';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles-decorator';
import { Application, Role } from '@prisma/client';
import { App } from 'src/auth/decorators/app-decorator';

@Resolver()
@UseGuards(RolesGuard)
export class HazardsResolver {
  constructor(private readonly hazardsService: HazardsService) {}

  @Roles(Role.COMPANY_USER, Role.SANDVIK_TECHNICIAN, Role.COMPANY_ADMIN)
  @App(Application.PULL_TEST)
  @Query('hazards')
  async findAll(
    @Args('companyId', ParseUUIDPipe) companyId: string,
  ): Promise<GraphQLTypes.BoltResult[]> {
    return this.hazardsService.findAll(companyId);
  }
}
