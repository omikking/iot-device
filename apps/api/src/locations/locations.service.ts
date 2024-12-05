import { Injectable } from '@nestjs/common';
import { Location } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Location[]> {
    return this.prisma.location.findMany();
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location) {
      throw new UserInputError(`Location #${id} not found`);
    }
    return location;
  }

  async create(
    createLocationInput: GraphQLTypes.CreateLocationInput,
  ): Promise<Location> {
    const createdLocation = await this.prisma.location.create({
      data: {
        locationName: createLocationInput.locationName,
        driveId: createLocationInput.driveId,
      },
    });

    if (!createdLocation) {
      throw new UserInputError('Failed to create location');
    }
    return createdLocation;
  }

  async update(
    id: string,
    updateLocationInput: GraphQLTypes.UpdateLocationInput,
  ): Promise<Location> {
    const updatedLocation = await this.prisma.location.update({
      where: { id },

      data: {
        locationName: updateLocationInput?.locationName || undefined,
      },
    });

    if (!updatedLocation) {
      throw new UserInputError(`Location #${id} not found`);
    }
    return updatedLocation;
  }

  async remove(id: string): Promise<Location> {
    const location = await this.prisma.location.delete({ where: { id } });
    if (!location) {
      throw new UserInputError(`Location #${id} not found`);
    }
    return location;
  }
}
