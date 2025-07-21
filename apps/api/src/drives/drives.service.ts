import { Injectable } from '@nestjs/common';
import { Drive } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';

@Injectable()
export class DrivesService {
  constructor(private prisma: PrismaService) {}

  findAll(
    allowedCompanyIds: string[] | null,
    isSandvikAdmin: boolean,
  ): Promise<Drive[]> {
    // Return all drives for Sandvik Admins, or filter by company access for users
    if (isSandvikAdmin) {
      return this.prisma.drive.findMany();
    }

    if (!allowedCompanyIds || allowedCompanyIds.length === 0) {
      return Promise.resolve([]);
      // Fix throw error later
    }

    return this.prisma.drive.findMany({
      where: {
        level: {
          site: {
            companyId: { in: allowedCompanyIds },
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Drive> {
    const drive = await this.prisma.drive.findUnique({ where: { id } });
    if (!drive) {
      throw new UserInputError('', {
        extensions: {
          code: 'DRIVE_NOTFOUND_ERROR',
          title: errorTexts.driveNotFound_title(id),
        },
      });
    }
    return drive;
  }

  async create(
    createDriveInput: GraphQLTypes.CreateDriveInput,
  ): Promise<Drive> {
    try {
      // Check duplicate drive name
      const existingDrive = await this.prisma.drive.findFirst({
        where: {
          driveName: createDriveInput.driveName,
          levelId: createDriveInput.levelId,
        },
      });

      if (existingDrive) {
        throw new UserInputError('', {
          extensions: {
            code: 'DRIVE_DUPLICATE_NAME_ERROR',
            title: errorTexts.duplicateDriveWarning_title,
            message: errorTexts.duplicateSiteLocationWarning_message('drive'),
            type: 'warning',
          },
        });
      }

      const createdDrive = await this.prisma.drive.create({
        data: {
          driveName: createDriveInput.driveName,
          levelId: createDriveInput.levelId,
        },
      });

      return createdDrive;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'DRIVE_CREATE_ERROR_GENERIC',
          title: errorTexts.driveCreateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async update(
    id: string,
    updateDriveInput: GraphQLTypes.UpdateDriveInput,
  ): Promise<Drive> {
    try {
      const currentDrive = await this.prisma.drive.findUnique({
        where: { id },
      });

      // Check duplicate drive name
      if (
        updateDriveInput?.driveName &&
        updateDriveInput.driveName !== currentDrive?.driveName
      ) {
        const existingDrive = await this.prisma.drive.findFirst({
          where: {
            driveName: updateDriveInput.driveName,
            levelId: currentDrive?.levelId,
            id: { not: id },
          },
        });

        if (existingDrive) {
          throw new UserInputError('', {
            extensions: {
              code: 'DRIVE_DUPLICATE_NAME_ERROR',
              title: errorTexts.duplicateDriveWarning_title,
              message: errorTexts.duplicateSiteLocationWarning_message('drive'),
              type: 'warning',
            },
          });
        }
      }

      const updatedDrive = await this.prisma.drive.update({
        where: { id },
        data: {
          driveName: updateDriveInput?.driveName || undefined,
        },
      });

      return updatedDrive;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'DRIVE_UPDATE_ERROR_GENERIC',
          title: errorTexts.driveUpdateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async remove(id: string): Promise<Drive> {
    const drive = await this.prisma.drive.findUnique({
      where: { id },
    });

    if (!drive) {
      throw new UserInputError('', {
        extensions: {
          code: 'DRIVE_NOTFOUND_ERROR',
          title: errorTexts.driveNotFound_title(id),
        },
      });
    }

    try {
      return await this.prisma.drive.delete({
        where: { id },
      });
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'DRIVE_DELETE_ERROR_GENERIC',
          title: errorTexts.driveDeleteError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }
}
