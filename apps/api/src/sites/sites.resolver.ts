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

  @Query('site')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Site> {
    return this.sitesService.findOne(id);
  }

  @Mutation('createSite')
  async create(
    @Args('createSiteInput')
    createSiteInput: CreateSiteInput,
  ): Promise<GraphQLTypes.Site> {
    return this.sitesService.create(createSiteInput);
  }

  @Mutation('updateSite')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateSiteInput')
    updateSiteInput: UpdateSiteInput,
  ): Promise<GraphQLTypes.Site> {
    return this.sitesService.update(id, updateSiteInput);
  }

  @Mutation('removeSite')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Site> {
    return this.sitesService.remove(id);
  }
}
