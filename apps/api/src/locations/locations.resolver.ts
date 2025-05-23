import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateLocationInput } from './dto/create-location.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdateLocationInput } from './dto/update-location.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles-decorator';
import { Role } from '@prisma/client';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
@Roles(
  Role.SANDVIK_ADMIN,
  Role.COMPANY_ADMIN,
  Role.COMPANY_USER,
  Role.SANDVIK_TECHNICIAN,
)
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
