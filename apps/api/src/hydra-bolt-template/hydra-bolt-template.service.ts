import { UserInputError } from '@nestjs/apollo';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import {
  Application,
  GlobalRole,
  HydraBoltTemplate,
  Prisma,
} from '@prisma/client';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { PrismaService } from 'src/prisma/prisma.service';
import { hasAppAccessForCompany, validateMineHierarchy } from 'src/utils';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class HydraBoltTemplateService {
  private allowedApps = [Application.HYDRA];
  private readonly logger = new Logger(HydraBoltTemplateService.name);

  constructor(private prisma: PrismaService) {}

  private toGraphQLError(
    error: unknown,
    context: string,
    extensions: { code: string; title: string; message?: string },
  ): Error {
    if (
      error instanceof UserInputError ||
      error instanceof ForbiddenException
    ) {
      return error;
    }

    this.logger.error(context, error instanceof Error ? error.stack : error);

    return new UserInputError('', {
      extensions: {
        message: errorTexts.contactSupportError,
        ...extensions,
      },
    });
  }

  private nextValue<T>(
    input: T | null | undefined,
    current: T | null,
  ): T | null {
    return input === undefined ? current : input;
  }

  async findOne(
    id: string,
    companyId: string,
    user: ActiveUserData,
  ): Promise<HydraBoltTemplate> {
    try {
      const [hasAccess, hydraBoltTemplate] = await Promise.all([
        hasAppAccessForCompany(this.prisma, user, this.allowedApps, companyId),
        this.prisma.hydraBoltTemplate.findUnique({ where: { id, companyId } }),
      ]);

      if (!hasAccess) {
        throw new ForbiddenException(
          'User missing access to this application for this company.',
        );
      }

      if (!hydraBoltTemplate) {
        throw new UserInputError('', {
          extensions: {
            code: 'HYDRA_BOLT_TEMPLATE_NOTFOUND_ERROR',
            title: errorTexts.hydraBoltTemplateNotFound_title(id),
          },
        });
      }

      return hydraBoltTemplate;
    } catch (error) {
      throw this.toGraphQLError(
        error,
        `Error fetching Hydra Bolt Template #${id}`,
        {
          code: 'HYDRA_BOLT_TEMPLATE_FETCH_ERROR',
          title: 'Failed to fetch Hydra Bolt Template',
        },
      );
    }
  }

  async findAll(
    filters: {
      offset?: number;
      limit?: number;
      levelId?: string;
      driveId?: string;
      locationId?: string;
      createdBy?: string;
      companyId?: string;
      siteId?: string;
      activateNotifications?: boolean;
    },
    allowedCompanyIds: string[],
    user: ActiveUserData,
  ): Promise<GraphQLTypes.HydraBoltTemplatesResponse> {
    try {
      const { offset = 0, limit = 10, ...restFilters } = filters;

      const { companyId } = restFilters;

      // Extract companyId and check if the user has access to the any of the applications
      if (companyId) {
        const hasAccess = await hasAppAccessForCompany(
          this.prisma,
          user,
          this.allowedApps,
          companyId,
        );

        if (!hasAccess) {
          throw new ForbiddenException(
            'User missing access to this application for this company.',
          );
        }
      }

      const where: Prisma.HydraBoltTemplateWhereInput = {};

      if (restFilters.levelId) {
        where.levelId = restFilters.levelId;
      }

      if (restFilters.driveId) {
        where.driveId = restFilters.driveId;
      }

      if (restFilters.locationId) {
        where.locationId = restFilters.locationId;
      }

      if (restFilters.createdBy) {
        where.createdBy = restFilters.createdBy;
      }

      if (restFilters.siteId) {
        where.siteId = restFilters.siteId;
      }

      if (restFilters.activateNotifications !== undefined) {
        where.activateNotifications = restFilters.activateNotifications;
      }

      // Scope the query to the companies this user is allowed to read.
      if (user.globalRole === GlobalRole.SANDVIK_ADMIN) {
        if (companyId) {
          where.companyId = companyId;
        }
      } else if (companyId) {
        if (!allowedCompanyIds.includes(companyId)) {
          throw new ForbiddenException(
            'User does not have access to this company.',
          );
        }
        where.companyId = companyId;
      } else {
        where.companyId = { in: allowedCompanyIds };
      }

      const [totalRecords, results] = await this.prisma.$transaction([
        this.prisma.hydraBoltTemplate.count({ where }),
        this.prisma.hydraBoltTemplate.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return {
        totalRecords,
        results,
      };
    } catch (error) {
      throw this.toGraphQLError(error, 'Error fetching Hydra Bolt Templates', {
        code: 'HYDRA_BOLT_TEMPLATE_FETCH_ERROR',
        title: 'Failed to fetch Hydra Bolt Templates',
      });
    }
  }

  async create(
    createHydraBoltTemplateInput: GraphQLTypes.CreateHydraBoltTemplateInput,
    user: ActiveUserData,
  ): Promise<HydraBoltTemplate> {
    try {
      const { companyId } = createHydraBoltTemplateInput;
      if (companyId) {
        const hasAccess = await hasAppAccessForCompany(
          this.prisma,
          user,
          this.allowedApps,
          companyId,
        );

        if (!hasAccess) {
          throw new ForbiddenException(
            'User missing access to this application for this company.',
          );
        }
      }

      const existingRequest = await this.prisma.hydraBoltTemplate.findFirst({
        where: { name: createHydraBoltTemplateInput.name, companyId },
        select: { id: true },
      });

      if (existingRequest) {
        throw new UserInputError('', {
          extensions: {
            code: 'HYDRA_BOLT_TEMPLATE_DUPLICATE_NAME',
            title: `A Hydra Bolt Template with name ${createHydraBoltTemplateInput.name} already exists`,
          },
        });
      }

      await validateMineHierarchy(this.prisma, {
        levelId: createHydraBoltTemplateInput.levelId || undefined,
        driveId: createHydraBoltTemplateInput.driveId || undefined,
        locationId: createHydraBoltTemplateInput.locationId || undefined,
      });

      return await this.prisma.hydraBoltTemplate.create({
        data: {
          name: createHydraBoltTemplateInput.name,
          siteId: createHydraBoltTemplateInput.siteId,
          levelId: createHydraBoltTemplateInput.levelId,
          driveId: createHydraBoltTemplateInput.driveId,
          locationId: createHydraBoltTemplateInput.locationId,
          coordinates: createHydraBoltTemplateInput.coordinates || undefined,
          locationDetails:
            createHydraBoltTemplateInput.locationDetails || undefined,
          boltInstallationDateTime:
            createHydraBoltTemplateInput.boltInstallationDateTime || undefined,
          ringPosition: createHydraBoltTemplateInput.ringPosition,
          comment: createHydraBoltTemplateInput.comment || undefined,
          activateNotifications:
            createHydraBoltTemplateInput.activateNotifications,
          companyId: createHydraBoltTemplateInput.companyId,
          createdBy: user.id,
          updatedBy: user.id,
        },
      });
    } catch (error) {
      throw this.toGraphQLError(error, 'Error creating Hydra Bolt Template', {
        code: 'HYDRA_BOLT_TEMPLATE_CREATION_ERROR_GENERIC',
        title: errorTexts.hydraBoltTemplateCreateError_title,
      });
    }
  }

  async update(
    id: string,
    updateHydraBoltTemplateInput: GraphQLTypes.UpdateHydraBoltTemplateInput,
    user: ActiveUserData,
  ): Promise<HydraBoltTemplate> {
    try {
      const { companyId, name } = updateHydraBoltTemplateInput;

      const [hasAccess, existingTemplate, duplicateName] = await Promise.all([
        hasAppAccessForCompany(this.prisma, user, this.allowedApps, companyId),
        this.prisma.hydraBoltTemplate.findUnique({
          where: { id, companyId },
          select: { levelId: true, driveId: true, locationId: true },
        }),
        this.prisma.hydraBoltTemplate.findFirst({
          where: { name, companyId, id: { not: id } },
          select: { id: true },
        }),
      ]);

      if (!hasAccess) {
        throw new ForbiddenException(
          'User missing access to this application for this company.',
        );
      }

      if (!existingTemplate) {
        throw new UserInputError('', {
          extensions: {
            code: 'HYDRA_BOLT_TEMPLATE_NOTFOUND_ERROR',
            title: errorTexts.hydraBoltTemplateNotFound_title(id),
          },
        });
      }

      if (duplicateName) {
        throw new UserInputError('', {
          extensions: {
            code: 'HYDRA_BOLT_TEMPLATE_DUPLICATE_NAME',
            title: errorTexts.hydraBoltTemplateDuplicateName_title(name),
          },
        });
      }

      const nextLevelId = this.nextValue(
        updateHydraBoltTemplateInput.levelId,
        existingTemplate.levelId,
      );
      const nextDriveId = this.nextValue(
        updateHydraBoltTemplateInput.driveId,
        existingTemplate.driveId,
      );
      const nextLocationId = this.nextValue(
        updateHydraBoltTemplateInput.locationId,
        existingTemplate.locationId,
      );

      if (
        nextLevelId !== existingTemplate.levelId ||
        nextDriveId !== existingTemplate.driveId ||
        nextLocationId !== existingTemplate.locationId
      ) {
        await validateMineHierarchy(this.prisma, {
          levelId: nextLevelId || undefined,
          driveId: nextDriveId || undefined,
          locationId: nextLocationId || undefined,
        });
      }

      return await this.prisma.hydraBoltTemplate.update({
        where: { id },
        data: {
          name: updateHydraBoltTemplateInput.name,
          siteId: updateHydraBoltTemplateInput.siteId,
          levelId: updateHydraBoltTemplateInput.levelId,
          driveId: updateHydraBoltTemplateInput.driveId,
          locationId: updateHydraBoltTemplateInput.locationId,
          coordinates: updateHydraBoltTemplateInput.coordinates || undefined,
          locationDetails:
            updateHydraBoltTemplateInput.locationDetails || undefined,
          boltInstallationDateTime:
            updateHydraBoltTemplateInput.boltInstallationDateTime || undefined,
          ringPosition: updateHydraBoltTemplateInput.ringPosition,
          comment: updateHydraBoltTemplateInput.comment || undefined,
          activateNotifications:
            updateHydraBoltTemplateInput.activateNotifications,
          updatedBy: user.id,
        },
      });
    } catch (error) {
      throw this.toGraphQLError(
        error,
        `Error updating Hydra Bolt Template #${id}`,
        {
          code: 'HYDRA_BOLT_TEMPLATE_UPDATE_ERROR_GENERIC',
          title: errorTexts.hydraBoltTemplateUpdateError_title,
        },
      );
    }
  }

  async remove(
    id: string,
    user: ActiveUserData,
    companyId: string,
  ): Promise<HydraBoltTemplate> {
    try {
      const hasAccess = await hasAppAccessForCompany(
        this.prisma,
        user,
        this.allowedApps,
        companyId,
      );

      if (!hasAccess) {
        throw new ForbiddenException(
          'User missing access to this application for this company.',
        );
      }

      try {
        return await this.prisma.hydraBoltTemplate.delete({
          where: { id, companyId },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new UserInputError('', {
            extensions: {
              code: 'HYDRA_BOLT_TEMPLATE_NOTFOUND_ERROR',
              title: errorTexts.hydraBoltTemplateNotFound_title(id),
            },
          });
        }

        throw error;
      }
    } catch (error) {
      throw this.toGraphQLError(
        error,
        `Error deleting Hydra Bolt Template #${id}`,
        {
          code: 'HYDRA_BOLT_TEMPLATE_DELETE_ERROR_GENERIC',
          title: errorTexts.hydraBoltTemplateDeleteError_title,
        },
      );
    }
  }
}
