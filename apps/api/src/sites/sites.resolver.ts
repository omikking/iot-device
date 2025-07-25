import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SitesService } from './sites.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateSiteInput } from './dto/create-site.input';
import { UpdateSiteInput } from './dto/update-site.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ActiveUser } from 'src/auth/decorators';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { getAllowedCompanyIds } from 'src/utils/resolveAllowedCompanyIds';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class SitesResolver {
  constructor(private readonly sitesService: SitesService) {}

  @Query('sites')
  async findAll(
    @ActiveUser() user: ActiveUserData,
  ): Promise<GraphQLTypes.Site[]> {
    const allowedCompanyIds = getAllowedCompanyIds(user);
    return this.sitesService.findAll(user, allowedCompanyIds);
  }

  @Roles([], [], 'site')
  @Query('site')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Site> {
    return this.sitesService.findOne(id);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'site')
  @Mutation('createSite')
  async create(
    @Args('createSiteInput')
    createSiteInput: CreateSiteInput,
  ): Promise<GraphQLTypes.Site> {
    return this.sitesService.create(createSiteInput);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'site')
  @Mutation('updateSite')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateSiteInput')
    updateSiteInput: UpdateSiteInput,
  ): Promise<GraphQLTypes.Site> {
    return this.sitesService.update(id, updateSiteInput);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'site')
  @Mutation('removeSite')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Site> {
    return this.sitesService.remove(id);
  }
}
