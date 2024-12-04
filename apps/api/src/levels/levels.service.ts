import { Injectable } from '@nestjs/common';
import { Level } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class LevelsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Level[]> {
    return this.prisma.level.findMany();
  }

  async findOne(id: string): Promise<Level> {
    const level = await this.prisma.level.findUnique({ where: { id } });
    if (!level) {
      throw new UserInputError(`Level #${id} not found`);
    }
    return level;
  }

  async create(
    createLevelInput: GraphQLTypes.CreateLevelInput,
  ): Promise<Level> {
    const createdLevel = await this.prisma.level.create({
      data: {
        levelName: createLevelInput.levelName,
        siteId: createLevelInput.siteId,
      },
    });

    if (!createdLevel) {
      throw new UserInputError('Failed to create level');
    }
    return createdLevel;
  }

  async update(
    id: string,
    updateLevelInput: GraphQLTypes.UpdateLevelInput,
  ): Promise<Level> {
    const updatedLevel = await this.prisma.level.update({
      where: { id },

      data: {
        levelName: updateLevelInput?.levelName || undefined,
      },
    });

    if (!updatedLevel) {
      throw new UserInputError(`Level #${id} not found`);
    }
    return updatedLevel;
  }

  async remove(id: string): Promise<Level> {
    const level = await this.prisma.level.delete({ where: { id } });
    if (!level) {
      throw new UserInputError(`Level #${id} not found`);
    }
    return level;
  }
}
