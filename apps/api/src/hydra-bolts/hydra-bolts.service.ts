import { UserInputError } from '@nestjs/apollo';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Application, BoltType, GlobalRole, HydraBolts } from '@prisma/client';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { PrismaService } from 'src/prisma/prisma.service';
import { hasAppAccessForCompany, validateMineHierarchy } from 'src/utils';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class HydraBoltsService {
  private allowedApps = [Application.HYDRA];
  private readonly logger = new Logger(HydraBoltsService.name);
  constructor(private prisma: PrismaService) {}

  async create(
    createHydraBoltInput: GraphQLTypes.CreateHydraBoltInput,
    user: ActiveUserData,
  ): Promise<HydraBolts> {
    try {
      const { companyId } = createHydraBoltInput;
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
      const existingRequest = await this.prisma.hydraBolts.findFirst({
        where: {
          serialNumber: createHydraBoltInput.serialNumber,
        },
      });

      if (existingRequest) {
        throw new UserInputError('', {
          extensions: {
            code: 'HYDRA_BOLT_DUPLICATE_SERIAL_NUMBER',
            title: `A Hydra Bolt with serial number ${createHydraBoltInput.serialNumber} already exists`,
          },
        });
      }

      await validateMineHierarchy(this.prisma, {
        levelId: createHydraBoltInput.levelId,
        driveId: createHydraBoltInput.driveId,
        locationId: createHydraBoltInput.locationId,
      });

      const createdHydraBolt = await this.prisma.hydraBolts.create({
        data: {
          serialNumber: createHydraBoltInput.serialNumber,
          name: createHydraBoltInput.name,
          siteId: createHydraBoltInput.siteId,
          levelId: createHydraBoltInput.levelId,
          driveId: createHydraBoltInput.driveId,
          locationId: createHydraBoltInput.locationId,
          coordinates: createHydraBoltInput.coordinates || undefined,
          locationDetails: createHydraBoltInput.locationDetails || undefined,
          boltInstallationDateTime:
            createHydraBoltInput.boltInstallationDateTime || undefined,
          ringPosition: createHydraBoltInput.ringPosition,
          comment: createHydraBoltInput.comment || undefined,
          activateNotifications: createHydraBoltInput.activateNotifications,
          boltType: createHydraBoltInput.boltType as BoltType,
          companyId: createHydraBoltInput.companyId,
          createdBy: user.id,
          updatedBy: user.id,
        },
      });

      return {
        ...createdHydraBolt,
      };
    } catch (error) {
      if (
        error instanceof UserInputError ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error('Error creating Hydra Bolt', error.stack);
      } else {
        this.logger.error('Error creating Hydra Bolt', error);
      }
      throw new UserInputError('', {
        extensions: {
          code: 'HYDRA_BOLT_CREATION_ERROR_GENERIC',
          title: errorTexts.bansheeRequestCreateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async findOne(
    id: string,
    user: ActiveUserData,
    companyId: string,
  ): Promise<HydraBolts> {
    try {
      // Extract companyId and check if the user has access to the any of the applications
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
      const hydraBolts = await this.prisma.hydraBolts.findUnique({
        where: { id },
      });

      if (!hydraBolts) {
        throw new UserInputError('', {
          extensions: {
            code: 'HYDRA_BOLT_NOTFOUND_ERROR',
            title: `Hydra Bolt #${id} not found`,
          },
        });
      }

      return {
        ...hydraBolts,
      };
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error(`Error fetching Hydra Bolt #${id}`, error.stack);
      } else {
        this.logger.error(`Error fetching Hydra Bolt #${id}`, error);
      }
      throw new UserInputError('', {
        extensions: {
          code: 'HYDRA_BOLT_FETCH_ERROR',
          title: 'Failed to fetch Hydra Bolt',
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async findAll(
    filters: {
      offset?: number;
      limit?: number;
      serialNumber?: string;
      levelId?: string;
      driveId?: string;
      locationId?: string;
      createdBy?: string;
      companyId?: string;
      siteId?: string;
      activateNotifications?: boolean;
      startDate?: Date;
      endDate?: Date;
    },
    allowedCompanyIds: string[],
    user: ActiveUserData,
  ): Promise<GraphQLTypes.HydraBoltsResponse> {
    try {
      const { offset = 0, limit = 10, ...restFilters } = filters;

      const { companyId } = filters || {};

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

      const where: any = {};

      if (restFilters.serialNumber) {
        where.serialNumber = {
          contains: restFilters.serialNumber,
          mode: 'insensitive',
        };
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

      if (restFilters.companyId) {
        where.companyId = restFilters.companyId;
      }

      if (restFilters.siteId) {
        where.siteId = restFilters.siteId;
      }

      if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
        if (restFilters.companyId) {
          if (!allowedCompanyIds.includes(restFilters.companyId)) {
            throw new ForbiddenException(
              'User does not have access to this company.',
            );
          }
          where.companyId = restFilters.companyId;
        } else {
          where.companyId = { in: allowedCompanyIds };
        }
      } else {
        if (restFilters.companyId) {
          where.companyId = restFilters.companyId;
        }
      }

      if (
        restFilters.startDate &&
        restFilters.endDate &&
        restFilters.companyId
      ) {
        if (restFilters.startDate && restFilters.endDate) {
          where.proceqData = {
            some: {
              updatedTimestamp: {
                gte: restFilters.startDate,
                lte: restFilters.endDate,
              },
            },
          };
        }
      }
      const totalRecords = await this.prisma.hydraBolts.count({
        where,
      });

      const results = await this.prisma.hydraBolts.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        totalRecords,
        results: results,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error fetching Hydra Bolts', error.stack);
      } else {
        this.logger.error('Error fetching Hydra Bolts', error);
      }
      throw new UserInputError('', {
        extensions: {
          code: 'HYDRA_BOLTS_FETCH_ERROR',
          title: 'Failed to fetch Hydra Bolts',
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async update(
    id: string,
    updateHydraBoltInput: GraphQLTypes.UpdateHydraBoltInput,
    user: ActiveUserData,
  ): Promise<HydraBolts> {
    try {
      const { companyId } = updateHydraBoltInput;
      // Extract companyId and check if the user has access to the any of the applications
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

      const existingRequest = await this.prisma.hydraBolts.findUnique({
        where: { id },
      });

      if (!existingRequest) {
        throw new UserInputError('', {
          extensions: {
            code: 'HYDRA_BOLT_NOTFOUND_ERROR',
            title: `Hydra Bolt #${id} not found`,
          },
        });
      }

      await validateMineHierarchy(this.prisma, {
        levelId: updateHydraBoltInput.levelId || existingRequest.levelId,
        driveId: updateHydraBoltInput.driveId || existingRequest.driveId,
        locationId:
          updateHydraBoltInput.locationId || existingRequest.locationId,
      });

      const updatedHydraBolt = await this.prisma.hydraBolts.update({
        where: { id },
        data: {
          name: updateHydraBoltInput.name,
          siteId: updateHydraBoltInput.siteId,
          levelId: updateHydraBoltInput.levelId,
          driveId: updateHydraBoltInput.driveId,
          locationId: updateHydraBoltInput.locationId,
          coordinates: updateHydraBoltInput.coordinates || undefined,
          locationDetails: updateHydraBoltInput.locationDetails || undefined,
          boltInstallationDateTime:
            updateHydraBoltInput.boltInstallationDateTime || undefined,
          ringPosition: updateHydraBoltInput.ringPosition,
          comment: updateHydraBoltInput.comment || undefined,
          updatedBy: user.id,
          activateNotifications: updateHydraBoltInput.activateNotifications,
        },
      });

      return {
        ...updatedHydraBolt,
      };
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error(`Error updating Hydra Bolt #${id}`, error.stack);
      } else {
        this.logger.error(`Error updating Hydra Bolt #${id}`, error);
      }
      throw new UserInputError('', {
        extensions: {
          code: 'HYDRA_BOLT_UPDATE_ERROR_GENERIC',
          title: errorTexts.boltResultUpdateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async remove(
    id: string,
    user: ActiveUserData,
    companyId: string,
  ): Promise<HydraBolts> {
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

    const hydraBolt = await this.prisma.hydraBolts.findUnique({
      where: { id },
    });

    if (!hydraBolt) {
      throw new UserInputError('', {
        extensions: {
          code: 'HYDRA_BOLT_NOTFOUND_ERROR',
          title: errorTexts.hydraBoltNotFound_title(id),
        },
      });
    }

    try {
      const deletedRequest = await this.prisma.hydraBolts.delete({
        where: { id },
      });

      return {
        ...deletedRequest,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error deleting Hydra Bolt #${id}`, error.stack);
      } else {
        this.logger.error(`Error deleting Hydra Bolt #${id}`, error);
      }
      throw new UserInputError('', {
        extensions: {
          code: 'HYDRA_BOLT_DELETE_ERROR_GENERIC',
          title: errorTexts.hydraBoltDeleteError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async validateSerialNumber(
    serialNumber: string,
    user: ActiveUserData,
    companyId: string,
  ): Promise<GraphQLTypes.ValidateHydraBoltSerialNumberResponse> {
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
      const hydraBolt = await this.prisma.hydraBolts.findFirst({
        where: {
          serialNumber,
        },
      });

      if (!hydraBolt) {
        return {
          isValid: true,
          errorCode: null,
          message: null,
        };
      }

      return {
        isValid: false,
        errorCode: 'HYDRA_BOLT_DUPLICATE_SERIAL_NUMBER',
        message:
          'Serial number has already been allocated to another Hydra Bolt.',
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error validating Hydra Bolt serial number #${serialNumber}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Error validating Hydra Bolt serial number #${serialNumber}`,
          error,
        );
      }
      throw new UserInputError('', {
        extensions: {
          code: 'HYDRA_BOLT_SERIAL_NUMBER_VALIDATE_ERROR_GENERIC',
          title: errorTexts.bansheeRequestDeleteError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }
}
