import { UserInputError } from '@nestjs/apollo';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { GlobalRole, HydraBolts, Prisma, Application } from '@prisma/client';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { PrismaService } from 'src/prisma/prisma.service';
import { hasAppAccessForCompany, validateMineHierarchy } from 'src/utils';
import * as GraphQLTypes from 'src/graphql-types';
import { HydraBoltService } from 'src/hydra-bolt/hydra-bolt.service';
import { OpticboltService } from 'src/opticbolt/opticbolt.service';

type ResolvedSensorConfig = {
  boltType: string;
  numberOfSensors: number;
  sensorDepths: number[];
};

type HydraBoltWithSensorConfig = Omit<HydraBolts, 'boltType'> & {
  boltType: string | null;
  numberOfSensors: number | null;
  sensorDepths: number[] | null;
};

@Injectable()
export class HydraBoltsService {
  private allowedApps = [Application.HYDRA];
  private readonly logger = new Logger(HydraBoltsService.name);
  constructor(
    private prisma: PrismaService,
    private readonly hydraBoltService: HydraBoltService,
    private readonly opticBoltService: OpticboltService,
  ) {}

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

  private async resolveSensorConfigs(
    serialNumbers: string[],
  ): Promise<Map<string, ResolvedSensorConfig>> {
    try {
      return await this.loadSensorConfigs(serialNumbers);
    } catch (error) {
      this.logger.error(
        'Error resolving Hydra Bolt sensor configuration',
        error instanceof Error ? error.stack : error,
      );

      return new Map<string, ResolvedSensorConfig>();
    }
  }

  private async loadSensorConfigs(
    serialNumbers: string[],
  ): Promise<Map<string, ResolvedSensorConfig>> {
    const configsBySerialNumber = new Map<string, ResolvedSensorConfig>();

    const uniqueSerialNumbers = [...new Set(serialNumbers)];
    if (!uniqueSerialNumbers.length) return configsBySerialNumber;

    const testResults =
      await this.opticBoltService.findBoltTypesBySerialNumbers(
        uniqueSerialNumbers,
      );

    const partNumbers = [
      ...new Set(
        testResults
          .map((testResult) => testResult.boltType)
          .filter((boltType): boltType is string => !!boltType),
      ),
    ];
    if (!partNumbers.length) return configsBySerialNumber;

    const catalogueEntries =
      await this.hydraBoltService.findSensorConfigsByPartNumbers(partNumbers);

    const catalogueByPartNumber = new Map(
      catalogueEntries.map((entry) => [entry.partNumber, entry]),
    );

    for (const { serialNumber, boltType } of testResults) {
      const entry = boltType ? catalogueByPartNumber.get(boltType) : undefined;
      if (!entry) continue;

      configsBySerialNumber.set(serialNumber, {
        boltType: entry.partNumber,
        numberOfSensors: entry.numberOfFBG,
        sensorDepths: entry.positionOfFBGs,
      });
    }

    return configsBySerialNumber;
  }

  private withSensorConfig(
    hydraBolt: HydraBolts,
    configsBySerialNumber: Map<string, ResolvedSensorConfig>,
  ): HydraBoltWithSensorConfig {
    const config = configsBySerialNumber.get(hydraBolt.serialNumber);

    return {
      ...hydraBolt,
      boltType: config?.boltType ?? null,
      numberOfSensors: config?.numberOfSensors ?? null,
      sensorDepths: config?.sensorDepths ?? null,
    };
  }

  private async assertTemplateBelongsToCompany(
    templateId: string,
    companyId: string,
  ) {
    const template = await this.prisma.hydraBoltTemplate.findUnique({
      where: { id: templateId },
      select: { companyId: true },
    });

    if (!template || template.companyId !== companyId) {
      throw new UserInputError('', {
        extensions: {
          code: 'HYDRA_BOLT_TEMPLATE_NOTFOUND_ERROR',
          title: `Hydra Bolt template #${templateId} not found`,
        },
      });
    }
  }

  async create(
    createHydraBoltInput: GraphQLTypes.CreateHydraBoltInput,
    user: ActiveUserData,
  ): Promise<HydraBolts> {
    try {
      const { companyId } = createHydraBoltInput;
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

      const existingRequest = await this.prisma.hydraBolts.findUnique({
        where: { serialNumber: createHydraBoltInput.serialNumber },
        select: { id: true },
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

      if (createHydraBoltInput.templateId) {
        await this.assertTemplateBelongsToCompany(
          createHydraBoltInput.templateId,
          createHydraBoltInput.companyId,
        );
      }

      return await this.prisma.hydraBolts.create({
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
          companyId: createHydraBoltInput.companyId,
          templateId: createHydraBoltInput.templateId,
          createdBy: user.id,
          updatedBy: user.id,
        },
      });
    } catch (error) {
      throw this.toGraphQLError(error, 'Error creating Hydra Bolt', {
        code: 'HYDRA_BOLT_CREATION_ERROR_GENERIC',
        title: errorTexts.hydraBoltCreateError_title,
      });
    }
  }

  async findOne(
    id: string,
    user: ActiveUserData,
    companyId: string,
  ): Promise<HydraBoltWithSensorConfig> {
    try {
      const [hasAccess, hydraBolt] = await Promise.all([
        hasAppAccessForCompany(this.prisma, user, this.allowedApps, companyId),
        this.prisma.hydraBolts.findUnique({ where: { id } }),
      ]);

      if (!hasAccess) {
        throw new ForbiddenException(
          'User missing access to this application for this company.',
        );
      }

      if (!hydraBolt) {
        throw new UserInputError('', {
          extensions: {
            code: 'HYDRA_BOLT_NOTFOUND_ERROR',
            title: `Hydra Bolt #${id} not found`,
          },
        });
      }

      const configsBySerialNumber = await this.resolveSensorConfigs([
        hydraBolt.serialNumber,
      ]);

      return this.withSensorConfig(hydraBolt, configsBySerialNumber);
    } catch (error) {
      throw this.toGraphQLError(error, `Error fetching Hydra Bolt #${id}`, {
        code: 'HYDRA_BOLT_FETCH_ERROR',
        title: 'Failed to fetch Hydra Bolt',
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
    },
    allowedCompanyIds: string[],
    user: ActiveUserData,
  ): Promise<GraphQLTypes.HydraBoltsResponse> {
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

      const where: Prisma.HydraBoltsWhereInput = {};

      if (restFilters.serialNumber) {
        where.serialNumber = {
          contains: restFilters.serialNumber,
          mode: 'insensitive',
        };
      }

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
        this.prisma.hydraBolts.count({ where }),
        this.prisma.hydraBolts.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      // One batched resolve for the whole page instead of two queries per row.
      const configsBySerialNumber = await this.resolveSensorConfigs(
        results.map((hydraBolt) => hydraBolt.serialNumber),
      );

      return {
        totalRecords,
        results: results.map((hydraBolt) =>
          this.withSensorConfig(hydraBolt, configsBySerialNumber),
        ),
      };
    } catch (error) {
      throw this.toGraphQLError(error, 'Error fetching Hydra Bolts', {
        code: 'HYDRA_BOLTS_FETCH_ERROR',
        title: 'Failed to fetch Hydra Bolts',
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
      const [hasAccess, existingRequest] = await Promise.all([
        hasAppAccessForCompany(this.prisma, user, this.allowedApps, companyId),
        this.prisma.hydraBolts.findUnique({ where: { id } }),
      ]);

      if (!hasAccess) {
        throw new ForbiddenException(
          'User missing access to this application for this company.',
        );
      }

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

      if (updateHydraBoltInput.templateId) {
        await this.assertTemplateBelongsToCompany(
          updateHydraBoltInput.templateId,
          companyId,
        );
      }

      return await this.prisma.hydraBolts.update({
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
          templateId: updateHydraBoltInput.templateId,
        },
      });
    } catch (error) {
      throw this.toGraphQLError(error, `Error updating Hydra Bolt #${id}`, {
        code: 'HYDRA_BOLT_UPDATE_ERROR_GENERIC',
        title: errorTexts.hydraBoltUpdateError_title,
      });
    }
  }

  async remove(
    id: string,
    user: ActiveUserData,
    companyId: string,
  ): Promise<HydraBolts> {
    try {
      const [hasAccess, hydraBolt] = await Promise.all([
        hasAppAccessForCompany(this.prisma, user, this.allowedApps, companyId),
        this.prisma.hydraBolts.findUnique({
          where: { id },
          select: { id: true },
        }),
      ]);

      if (!hasAccess) {
        throw new ForbiddenException(
          'User missing access to this application for this company.',
        );
      }

      if (!hydraBolt) {
        throw new UserInputError('', {
          extensions: {
            code: 'HYDRA_BOLT_NOTFOUND_ERROR',
            title: errorTexts.hydraBoltNotFound_title(id),
          },
        });
      }

      return await this.prisma.hydraBolts.delete({ where: { id } });
    } catch (error) {
      throw this.toGraphQLError(error, `Error deleting Hydra Bolt #${id}`, {
        code: 'HYDRA_BOLT_DELETE_ERROR_GENERIC',
        title: errorTexts.hydraBoltDeleteError_title,
      });
    }
  }

  async validateSerialNumber(
    serialNumber: string,
    user: ActiveUserData,
    companyId: string,
  ): Promise<GraphQLTypes.ValidateHydraBoltSerialNumberResponse> {
    try {
      const [hasAccess, hydraBolt] = await Promise.all([
        hasAppAccessForCompany(this.prisma, user, this.allowedApps, companyId),
        this.prisma.hydraBolts.findUnique({
          where: { serialNumber },
          select: { id: true },
        }),
      ]);

      if (!hasAccess) {
        throw new ForbiddenException(
          'User missing access to this application for this company.',
        );
      }

      if (hydraBolt) {
        return {
          isValid: false,
          errorCode: 'HYDRA_BOLT_DUPLICATE_SERIAL_NUMBER',
          message:
            'Serial number has already been allocated to another Hydra Bolt.',
          boltConfig: null,
        };
      }

      const boltConfig =
        (await this.loadSensorConfigs([serialNumber])).get(serialNumber) ??
        null;

      if (!boltConfig) {
        return {
          isValid: false,
          errorCode: 'HYDRA_BOLT_TYPE_AND_DEPTH_NOTFOUND_ERROR',
          message: `No bolt type and sensor depth on record for serial number ${serialNumber}.`,
          boltConfig: null,
        };
      }

      return {
        isValid: true,
        errorCode: null,
        message: null,
        boltConfig,
      };
    } catch (error) {
      throw this.toGraphQLError(
        error,
        `Error validating Hydra Bolt serial number #${serialNumber}`,
        {
          code: 'HYDRA_BOLT_SERIAL_NUMBER_VALIDATE_ERROR_GENERIC',
          title: errorTexts.hydraBoltSerialNumberValidateError_title,
        },
      );
    }
  }
}
