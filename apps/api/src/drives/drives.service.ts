import { Injectable } from '@nestjs/common';
import { Drive } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';

@Injectable()
export class DrivesService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Drive[]> {
    return this.prisma.drive.findMany();
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
      const createdDrive = await this.prisma.drive.create({
        data: {
          driveName: createDriveInput.driveName,
          levelId: createDriveInput.levelId,
        },
      });

      if (!createdDrive) {
        throw new UserInputError('', {
          extensions: {
            code: 'DRIVE_CREATE_ERROR',
            title: errorTexts.driveCreateError_title,
          },
        });
      }
      return createdDrive;
    } catch (error) {
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
      const updatedDrive = await this.prisma.drive.update({
        where: { id },

        data: {
          driveName: updateDriveInput?.driveName || undefined,
        },
      });

      if (!updatedDrive) {
        throw new UserInputError('', {
          extensions: {
            code: 'DRIVE_NOTFOUND_ERROR',
            title: errorTexts.driveNotFound_title(id),
          },
        });
      }
      return updatedDrive;
    } catch (error) {
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
