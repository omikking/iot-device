import { Injectable } from '@nestjs/common';
import { GlobalRole, Level } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';

@Injectable()
export class LevelsService {
  constructor(private prisma: PrismaService) {}

  findAll(user: ActiveUserData, allowedCompanyIds: string[]): Promise<Level[]> {
    if (user.globalRole === GlobalRole.SANDVIK_ADMIN) {
      return this.prisma.level.findMany();
    }
    return this.prisma.level.findMany({
      where: {
        site: {
          companyId: { in: allowedCompanyIds },
        },
      },
    });
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
      // Check duplicate level name
      const existingLevel = await this.prisma.level.findFirst({
        where: {
          levelName: createLevelInput.levelName,
          siteId: createLevelInput.siteId,
        },
      });

      if (existingLevel) {
        throw new UserInputError('', {
          extensions: {
            code: 'LEVEL_DUPLICATE_NAME_ERROR',
            title: errorTexts.duplicateLevelWarning_title,
            message: errorTexts.duplicateSiteLocationWarning_message('level'),
            type: 'warning',
          },
        });
      }

      const createdLevel = await this.prisma.level.create({
        data: {
          levelName: createLevelInput.levelName,
          siteId: createLevelInput.siteId,
        },
      });

      return createdLevel;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
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
      const currentLevel = await this.prisma.level.findUnique({
        where: { id },
      });

      // Check duplicate level name
      if (
        updateLevelInput?.levelName &&
        updateLevelInput.levelName !== currentLevel?.levelName
      ) {
        const existingLevel = await this.prisma.level.findFirst({
          where: {
            levelName: updateLevelInput.levelName,
            siteId: currentLevel?.siteId,
            id: { not: id },
          },
        });

        if (existingLevel) {
          throw new UserInputError('', {
            extensions: {
              code: 'LEVEL_DUPLICATE_NAME_ERROR',
              title: errorTexts.duplicateLevelWarning_title,
              message: errorTexts.duplicateSiteLocationWarning_message('level'),
              type: 'warning',
            },
          });
        }
      }

      const updatedLevel = await this.prisma.level.update({
        where: { id },
        data: {
          levelName: updateLevelInput?.levelName || undefined,
        },
      });

      return updatedLevel;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
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
      if (error instanceof UserInputError) {
        throw error;
      }
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
