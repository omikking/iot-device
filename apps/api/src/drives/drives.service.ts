import { Injectable } from '@nestjs/common';
import { Drive } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class DrivesService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Drive[]> {
    return this.prisma.drive.findMany();
  }

  async findOne(id: string): Promise<Drive> {
    const drive = await this.prisma.drive.findUnique({ where: { id } });
    if (!drive) {
      throw new UserInputError(`Drive #${id} not found`);
    }
    return drive;
  }

  async create(
    createDriveInput: GraphQLTypes.CreateDriveInput,
  ): Promise<Drive> {
    const createdDrive = await this.prisma.drive.create({
      data: {
        driveName: createDriveInput.driveName,
        levelId: createDriveInput.levelId,
      },
    });

    if (!createdDrive) {
      throw new UserInputError('Failed to create drive');
    }
    return createdDrive;
  }

  async update(
    id: string,
    updateDriveInput: GraphQLTypes.UpdateDriveInput,
  ): Promise<Drive> {
    const updatedDrive = await this.prisma.drive.update({
      where: { id },

      data: {
        driveName: updateDriveInput?.driveName || undefined,
      },
    });

    if (!updatedDrive) {
      throw new UserInputError(`Drive #${id} not found`);
    }
    return updatedDrive;
  }

  async remove(id: string): Promise<Drive> {
    return this.prisma.drive.delete({
      where: { id },
    });
  }
}
