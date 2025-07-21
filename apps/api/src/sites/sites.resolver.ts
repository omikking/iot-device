import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SitesService } from './sites.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateSiteInput } from './dto/create-site.input';
import { UpdateSiteInput } from './dto/update-site.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GlobalRole, Role } from '@prisma/client';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { RequireRoles } from 'src/auth/decorators/permission.decorator';

@Resolver()
@UseGuards(JwtGuard, PermissionGuard)
export class SitesResolver {
  constructor(private readonly sitesService: SitesService) {}

  // TODO Need checks/guards here?
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

  // @RequireCompanyAccess(true)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Mutation('createSite')
  async create(
    @Args('createSiteInput')
    createSiteInput: CreateSiteInput,
  ): Promise<GraphQLTypes.Site> {
    return this.sitesService.create(createSiteInput);
  }

  // @RequireCompanyAccess(true)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Mutation('updateSite')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateSiteInput')
    updateSiteInput: UpdateSiteInput,
  ): Promise<GraphQLTypes.Site> {
    return this.sitesService.update(id, updateSiteInput);
  }

  // @RequireCompanyAccess(true)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Mutation('removeSite')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Site> {
    return this.sitesService.remove(id);
  }
}
