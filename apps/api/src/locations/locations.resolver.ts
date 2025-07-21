import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateLocationInput } from './dto/create-location.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdateLocationInput } from './dto/update-location.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { CompanyContextGuard } from 'src/auth/guard/company-context.guard';
import { RequireCompanyAccess } from 'src/auth/decorators/permission.decorator';
import { CompaniesAccessGuard } from 'src/auth/guard/companies-access.guard';

@Resolver()
@UseGuards(JwtGuard, CompanyContextGuard, PermissionGuard)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  // TODO what restrictions do we want here?
  // Should any role be able to create, update, delete or just company admins?
  @UseGuards(CompaniesAccessGuard)
  @Query('locations')
  async findAll(@Context() context: any): Promise<GraphQLTypes.Location[]> {
    return this.locationsService.findAll(
      context.allowedCompanyIds,
      context.isSandvikAdmin,
    );
  }

  @RequireCompanyAccess(true)
  @Query('location')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.findOne(id);
  }

  @RequireCompanyAccess(true)
  @Mutation('createLocation')
  async create(
    @Args('createLocationInput')
    createLocationInput: CreateLocationInput,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.create(createLocationInput);
  }

  @RequireCompanyAccess(true)
  @Mutation('updateLocation')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateLocationInput')
    updateLocationInput: UpdateLocationInput,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.update(id, updateLocationInput);
  }

  @RequireCompanyAccess(true)
  @Mutation('removeLocation')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.remove(id);
  }
}
