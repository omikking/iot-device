import { Injectable } from '@nestjs/common';
import { Location } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenError, UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  findAll(
    allowedCompanyIds: string[] | null,
    isSandvikAdmin: boolean,
  ): Promise<Location[]> {
    // Return all location for Sandvik Admins, or filter by company access for users
    if (isSandvikAdmin) {
      return this.prisma.location.findMany();
    }
    if (!allowedCompanyIds || allowedCompanyIds.length === 0) {
      throw new ForbiddenError(errorTexts.permissionsDenied);
    }
    return this.prisma.location.findMany({
      where: {
        drive: {
          level: {
            site: {
              companyId: { in: allowedCompanyIds },
            },
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location) {
      throw new UserInputError('', {
        extensions: {
          code: 'LOCATION_NOTFOUND_ERROR',
          title: errorTexts.locationNotFound_title(id),
        },
      });
    }
    return location;
  }

  async create(
    createLocationInput: GraphQLTypes.CreateLocationInput,
  ): Promise<Location> {
    try {
      // Check duplicate location name
      const existingLocation = await this.prisma.location.findFirst({
        where: {
          locationName: createLocationInput.locationName,
          driveId: createLocationInput.driveId,
        },
      });

      if (existingLocation) {
        throw new UserInputError('', {
          extensions: {
            code: 'LOCATION_DUPLICATE_NAME_ERROR',
            title: errorTexts.duplicateLocationWarning_title,
            message:
              errorTexts.duplicateSiteLocationWarning_message('location'),
            type: 'warning',
          },
        });
      }

      const createdLocation = await this.prisma.location.create({
        data: {
          locationName: createLocationInput.locationName,
          driveId: createLocationInput.driveId,
        },
      });

      return createdLocation;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'LOCATION_CREATE_ERROR_GENERIC',
          title: errorTexts.locationCreateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async update(
    id: string,
    updateLocationInput: GraphQLTypes.UpdateLocationInput,
  ): Promise<Location> {
    try {
      const currentLocation = await this.prisma.location.findUnique({
        where: { id },
      });

      // Check duplicate location name
      if (
        updateLocationInput?.locationName &&
        updateLocationInput.locationName !== currentLocation?.locationName
      ) {
        const existingLocation = await this.prisma.location.findFirst({
          where: {
            locationName: updateLocationInput.locationName,
            driveId: currentLocation?.driveId,
            id: { not: id },
          },
        });

        if (existingLocation) {
          throw new UserInputError('', {
            extensions: {
              code: 'LOCATION_DUPLICATE_NAME_ERROR',
              title: errorTexts.duplicateLocationWarning_title,
              message:
                errorTexts.duplicateSiteLocationWarning_message('location'),
              type: 'warning',
            },
          });
        }
      }

      const updatedLocation = await this.prisma.location.update({
        where: { id },
        data: {
          locationName: updateLocationInput?.locationName || undefined,
        },
      });

      return updatedLocation;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'LOCATION_UPDATE_ERROR_GENERIC',
          title: errorTexts.locationUpdateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async remove(id: string): Promise<Location> {
    const location = await this.prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      throw new UserInputError('', {
        extensions: {
          code: 'LOCATION_NOTFOUND_ERROR',
          title: errorTexts.locationNotFound_title(id),
        },
      });
    }

    try {
      return await this.prisma.location.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'LOCATION_DELETE_ERROR',
          title: errorTexts.locationDeleteError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }
}
