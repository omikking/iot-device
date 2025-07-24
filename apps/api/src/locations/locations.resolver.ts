import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateLocationInput } from './dto/create-location.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdateLocationInput } from './dto/update-location.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  // FIx here
  @Query('locations')
  async findAll(): Promise<GraphQLTypes.Location[]> {
    return this.locationsService.findAll();
  }

  @Roles([], [], 'location')
  @Query('location')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.findOne(id);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'location')
  @Mutation('createLocation')
  async create(
    @Args('createLocationInput')
    createLocationInput: CreateLocationInput,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.create(createLocationInput);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'location')
  @Mutation('updateLocation')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateLocationInput')
    updateLocationInput: UpdateLocationInput,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.update(id, updateLocationInput);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'location')
  @Mutation('removeLocation')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.remove(id);
  }
}
