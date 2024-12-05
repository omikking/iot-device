import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateLocationInput } from './dto/create-location.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdateLocationInput } from './dto/update-location.input';

@Resolver()
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Query('locations')
  async findAll(): Promise<GraphQLTypes.Location[]> {
    return this.locationsService.findAll();
  }

  @Query('location')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.findOne(id);
  }

  @Mutation('createLocation')
  async create(
    @Args('createLocationInput')
    createLocationInput: CreateLocationInput,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.create(createLocationInput);
  }

  @Mutation('updateLocation')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateLocationInput')
    updateLocationInput: UpdateLocationInput,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.update(id, updateLocationInput);
  }

  @Mutation('removeLocation')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.remove(id);
  }
}
