import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateLocationInput } from './dto/create-location.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdateLocationInput } from './dto/update-location.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { PermissionGuard } from 'src/auth/guard/permission.guard';

@Resolver()
@UseGuards(JwtGuard, PermissionGuard)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  // TODO How do we handle restrictions here?

  // @RequireCompanyAccess(true)
  @Query('locations')
  async findAll(): Promise<GraphQLTypes.Location[]> {
    return this.locationsService.findAll();
  }

  // @RequireCompanyAccess(true)
  @Query('location')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.findOne(id);
  }

  // @RequireCompanyAccess(true)
  @Mutation('createLocation')
  async create(
    @Args('createLocationInput')
    createLocationInput: CreateLocationInput,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.create(createLocationInput);
  }

  // @RequireCompanyAccess(true)
  @Mutation('updateLocation')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateLocationInput')
    updateLocationInput: UpdateLocationInput,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.update(id, updateLocationInput);
  }

  // @RequireCompanyAccess(true)
  @Mutation('removeLocation')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.remove(id);
  }
}
