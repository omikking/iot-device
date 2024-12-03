import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SitesService } from './sites.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateSiteInput } from './dto/create-site.input';
import { UpdateSiteInput } from './dto/update-site.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver()
export class SitesResolver {
  constructor(private readonly sitesService: SitesService) {}

  @Query('sites')
  async findAll(): Promise<GraphQLTypes.Site[]> {
    return this.sitesService.findAll();
  }
}
