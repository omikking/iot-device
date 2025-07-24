import { Args, Query, Resolver } from '@nestjs/graphql';
import { HazardsService } from './hazards.service';
import * as GraphQLTypes from 'src/graphql-types';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver()
export class HazardsResolver {
  constructor(private readonly hazardsService: HazardsService) {}

  // Fix here
  @Query('hazards')
  async findAll(
    @Args('companyId', ParseUUIDPipe) companyId: string,
  ): Promise<GraphQLTypes.BoltResult[]> {
    return this.hazardsService.findAll(companyId);
  }
}
