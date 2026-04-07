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
import { getAllowedCompanyIds } from 'src/utils/resolveAllowedCompanyIds';
import { ActiveUser } from 'src/auth/decorators';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Query('locations')
  async findAll(
    @ActiveUser() user: ActiveUserData,
  ): Promise<GraphQLTypes.Location[]> {
    const allowedCompanyIds = getAllowedCompanyIds(user);
    return this.locationsService.findAll(user, allowedCompanyIds);
  }

  @Roles([], [], 'location')
  @Query('location')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.findOne(id);
  }

  @Roles([Role.COMPANY_ADMIN, Role.SANDVIK_TECHNICIAN], [], 'location')
  @Mutation('createLocation')
  async create(
    @Args('createLocationInput')
    createLocationInput: CreateLocationInput,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.create(createLocationInput);
  }

  @Roles([Role.COMPANY_ADMIN, Role.SANDVIK_TECHNICIAN], [], 'location')
  @Mutation('updateLocation')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateLocationInput')
    updateLocationInput: UpdateLocationInput,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.update(id, updateLocationInput);
  }

  @Roles([Role.COMPANY_ADMIN, Role.SANDVIK_TECHNICIAN], [], 'location')
  @Mutation('removeLocation')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Location> {
    return this.locationsService.remove(id);
  }
}
