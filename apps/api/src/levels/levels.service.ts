import { Injectable } from '@nestjs/common';
import { Level } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';

@Injectable()
export class LevelsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Level[]> {
    return this.prisma.level.findMany();
  }

  async findOne(id: string): Promise<Level> {
    const level = await this.prisma.level.findUnique({ where: { id } });
    if (!level) {
      throw new UserInputError('', {
        extensions: {
          code: 'LEVEL_NOTFOUND_ERROR',
          title: errorTexts.levelNotFound_title(id),
        },
      });
    }
    return level;
  }

  async create(
    createLevelInput: GraphQLTypes.CreateLevelInput,
  ): Promise<Level> {
    try {
      const createdLevel = await this.prisma.level.create({
        data: {
          levelName: createLevelInput.levelName,
          siteId: createLevelInput.siteId,
        },
      });

      if (!createdLevel) {
        throw new UserInputError('', {
          extensions: {
            code: 'LEVEL_CREATEFAILED_ERROR',
            title: errorTexts.levelCreateError_title,
          },
        });
      }
      return createdLevel;
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'LEVEL_CREATE_ERROR_GENERIC',
          title: errorTexts.levelCreateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async update(
    id: string,
    updateLevelInput: GraphQLTypes.UpdateLevelInput,
  ): Promise<Level> {
    try {
      const updatedLevel = await this.prisma.level.update({
        where: { id },

        data: {
          levelName: updateLevelInput?.levelName || undefined,
        },
      });

      if (!updatedLevel) {
        throw new UserInputError('', {
          extensions: {
            code: 'LEVEL_NOTFOUND_ERROR',
            title: errorTexts.levelNotFound_title(id),
          },
        });
      }
      return updatedLevel;
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'LEVEL_UPDATE_ERROR_GENERIC',
          title: errorTexts.levelUpdateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async remove(id: string): Promise<Level> {
    const level = await this.prisma.level.findUnique({
      where: { id },
    });

    if (!level) {
      throw new UserInputError('', {
        extensions: {
          code: 'LEVEL_NOTFOUND_ERROR',
          title: errorTexts.levelNotFound_title(id),
        },
      });
    }

    try {
      return await this.prisma.level.delete({
        where: { id },
      });
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'LEVEL_DELETE_ERROR_GENERIC',
          title: errorTexts.levelDeleteError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }
}
