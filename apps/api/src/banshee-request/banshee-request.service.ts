import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { extname, join } from 'path';
import { createWriteStream } from 'fs';
import { promises as fs } from 'fs';
import { randomBytes } from 'crypto';
import {
  Application,
  BansheeCartItemType,
  BansheeOrderItemStatus,
  BansheeRequest,
  BoltType,
  GlobalRole,
  ProceqStatus,
} from '@prisma/client';
import { BansheeStatsService } from 'src/banshee-stats/banshee-stats.service';
import { hasAppAccessForCompany } from 'src/utils';

@Injectable()
export class BansheeRequestsService {
  private readonly logger = new Logger(BansheeRequestsService.name);

  constructor(
    private prisma: PrismaService,
    private statsService: BansheeStatsService,
  ) {}

  async create(
    createBansheeRequestInput: GraphQLTypes.CreateBansheeRequestInput,
    user: ActiveUserData,
  ): Promise<BansheeRequest> {
    try {
      const existingRequest = await this.prisma.bansheeRequest.findFirst({
        where: {
          serialNumber: createBansheeRequestInput.serialNumber,
        },
      });

      if (existingRequest) {
        throw new UserInputError('', {
          extensions: {
            code: 'BANSHEE_REQUEST_DUPLICATE_SERIAL_NUMBER',
            title: `A banshee request with serial number ${createBansheeRequestInput.serialNumber} already exists`,
          },
        });
      }

      await this.validateRelations(
        createBansheeRequestInput.levelId,
        createBansheeRequestInput.driveId,
        createBansheeRequestInput.locationId,
      );

      if (createBansheeRequestInput.bansheeOrderItemId) {
        const orderItem = await this.prisma.bansheeOrderItem.findUnique({
          where: { id: createBansheeRequestInput.bansheeOrderItemId },
          select: {
            id: true,
            itemType: true,
            status: true,
            order: { select: { companyId: true } },
          },
        });

        if (!orderItem) {
          throw new UserInputError('', {
            extensions: {
              code: 'BANSHEE_ORDER_ITEM_NOTFOUND_ERROR',
              title: `Banshee order item #${createBansheeRequestInput.bansheeOrderItemId} not found`,
            },
          });
        }

        if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
          try {
            await this.validateUserCompanyAccess(
              user,
              orderItem.order.companyId,
            );
          } catch {
            throw new ForbiddenException(
              'User does not have access to this banshee order.',
            );
          }
        }

        if (orderItem.status !== BansheeOrderItemStatus.PENDING) {
          throw new UserInputError('', {
            extensions: {
              code: 'BANSHEE_ORDER_ITEM_INVALID_TYPE',
              title: 'Banshee order item must be of pending status',
            },
          });
        }

        if (orderItem.itemType !== BansheeCartItemType.NEW_BANSHEE) {
          throw new UserInputError('', {
            extensions: {
              code: 'BANSHEE_ORDER_ITEM_INVALID_TYPE',
              title: 'Banshee order item must be of type NEW_BANSHEE',
            },
          });
        }
      }

      let imagePaths: string[] | undefined;
      if (
        createBansheeRequestInput.images &&
        createBansheeRequestInput.images.length > 0
      ) {
        imagePaths = [];
        for (const image of createBansheeRequestInput.images) {
          const imagePath = await this.saveImage(image);
          imagePaths.push(imagePath);
        }
      }

      const createdBansheeRequest = await this.prisma.$transaction(
        async (tx) => {
          const created = await tx.bansheeRequest.create({
            data: {
              serialNumber: createBansheeRequestInput.serialNumber,
              name: createBansheeRequestInput.name || undefined,
              levelId: createBansheeRequestInput.levelId,
              driveId: createBansheeRequestInput.driveId,
              locationId: createBansheeRequestInput.locationId,
              coordinates: createBansheeRequestInput.coordinates || undefined,
              period: createBansheeRequestInput.period,
              locationDetails:
                createBansheeRequestInput.locationDetails || undefined,
              boltInstallationDateTime:
                createBansheeRequestInput.boltInstallationDateTime || undefined,
              ringPosition: createBansheeRequestInput.ringPosition || undefined,
              comment: createBansheeRequestInput.comment || undefined,
              isBrokenBolt: createBansheeRequestInput.isBrokenBolt,
              isNotMeasurable: createBansheeRequestInput.isNotMeasurable,
              measured: createBansheeRequestInput.measured ?? undefined,
              images:
                imagePaths && imagePaths.length > 0 ? imagePaths : undefined,
              boltType: createBansheeRequestInput.boltType as BoltType,
              createdBy: user.id,
              updatedBy: user.id,
              companyId: createBansheeRequestInput.companyId,
              siteId: createBansheeRequestInput.siteId,
            },
          });

          if (createBansheeRequestInput.bansheeOrderItemId) {
            await tx.bansheeOrderItem.update({
              where: { id: createBansheeRequestInput.bansheeOrderItemId },
              data: {
                bansheeRequestId: created.id,
                name: null,
                siteId: null,
                locationId: null,
                levelId: null,
                driveId: null,
                period: null,
              },
            });
          }

          return created;
        },
      );

      return {
        ...createdBansheeRequest,
      };
    } catch (error) {
      if (
        error instanceof UserInputError ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error('Error creating banshee request', error.stack);
      } else {
        this.logger.error('Error creating banshee request', error);
      }
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUEST_CREATION_ERROR_GENERIC',
          title: errorTexts.bansheeRequestCreateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async update(
    id: string,
    updateBansheeRequestInput: GraphQLTypes.UpdateBansheeRequestInput,
    user: ActiveUserData,
  ): Promise<BansheeRequest> {
    try {
      const existingRequest = await this.prisma.bansheeRequest.findUnique({
        where: { id },
      });

      if (!existingRequest) {
        throw new UserInputError('', {
          extensions: {
            code: 'BANSHEE_REQUEST_NOTFOUND_ERROR',
            title: `Banshee request #${id} not found`,
          },
        });
      }

      if (updateBansheeRequestInput.companyId) {
        await this.validateUserCompanyAccess(
          user,
          updateBansheeRequestInput.companyId,
        );
      }

      if (
        updateBansheeRequestInput.levelId ||
        updateBansheeRequestInput.driveId ||
        updateBansheeRequestInput.locationId
      ) {
        await this.validateRelations(
          updateBansheeRequestInput.levelId || existingRequest.levelId,
          updateBansheeRequestInput.driveId || existingRequest.driveId,
          updateBansheeRequestInput.locationId || existingRequest.locationId,
        );
      }

      // A template is only a reference for "where these values came from", but it
      // must still be a real template belonging to the same company.
      if (updateBansheeRequestInput.templateId) {
        const template = await this.prisma.bansheeTemplate.findUnique({
          where: { id: updateBansheeRequestInput.templateId },
          select: { id: true, companyId: true },
        });

        if (!template) {
          throw new UserInputError('', {
            extensions: {
              code: 'BANSHEE_TEMPLATE_NOTFOUND_ERROR',
              title: `Banshee template #${updateBansheeRequestInput.templateId} not found`,
            },
          });
        }

        const targetCompanyId = existingRequest.companyId;

        if (template.companyId !== targetCompanyId) {
          throw new UserInputError('', {
            extensions: {
              code: 'BANSHEE_TEMPLATE_COMPANY_MISMATCH_ERROR',
              title: 'Template does not belong to the specified company',
              message:
                'The specified template belongs to a different company than the banshee request.',
            },
          });
        }
      }

      let imagePaths: string[] | undefined;
      if (
        updateBansheeRequestInput &&
        updateBansheeRequestInput.images &&
        updateBansheeRequestInput.images.length > 0
      ) {
        const newPaths: string[] = [];
        for (const image of updateBansheeRequestInput.images) {
          newPaths.push(await this.saveImage(image));
        }
        imagePaths = [...(existingRequest.images ?? []), ...newPaths];
      }

      if (
        updateBansheeRequestInput.period !== undefined &&
        existingRequest.period !== updateBansheeRequestInput.period
      ) {
        const allProceqData = await this.prisma.proceqData.findMany({
          where: { bansheeRequestId: id },
          select: { id: true, updatedTimestamp: true },
        });

        await Promise.all(
          allProceqData
            .filter((p) => p.updatedTimestamp !== null)
            .map((p) => {
              const due = new Date(p.updatedTimestamp!);
              due.setMonth(due.getMonth() + updateBansheeRequestInput.period!);
              return this.prisma.proceqData.update({
                where: { id: p.id },
                data: { dueDate: due },
              });
            }),
        );
      }

      const updatedBansheeRequest = await this.prisma.bansheeRequest.update({
        where: { id },
        data: {
          serialNumber: updateBansheeRequestInput.serialNumber || undefined,
          name: updateBansheeRequestInput.name || undefined,
          levelId: updateBansheeRequestInput.levelId || undefined,
          driveId: updateBansheeRequestInput.driveId || undefined,
          locationId: updateBansheeRequestInput.locationId || undefined,
          coordinates: updateBansheeRequestInput.coordinates || undefined,
          period: updateBansheeRequestInput.period || undefined,
          // Nullable column, and the form can legitimately empty it (applying a
          // template with no location details), so '' must clear rather than
          // read as "unchanged". Omitted still leaves the column alone.
          locationDetails:
            updateBansheeRequestInput.locationDetails === undefined
              ? undefined
              : updateBansheeRequestInput.locationDetails || null,
          boltInstallationDateTime:
            updateBansheeRequestInput.boltInstallationDateTime || undefined,
          ringPosition: updateBansheeRequestInput.ringPosition || undefined,
          // Same as locationDetails: an emptied comment must actually clear.
          comment:
            updateBansheeRequestInput.comment === undefined
              ? undefined
              : updateBansheeRequestInput.comment || null,
          isBrokenBolt: updateBansheeRequestInput.isBrokenBolt ?? undefined,
          isNotMeasurable:
            updateBansheeRequestInput.isNotMeasurable ?? undefined,
          images: imagePaths ?? undefined,
          updatedBy: user.id,
          measured: updateBansheeRequestInput.measured ?? undefined,
          activateNotifications:
            updateBansheeRequestInput.activateNotifications ?? undefined,
          siteId: updateBansheeRequestInput.siteId || undefined,
          // Omitted -> untouched; empty/null -> detach the template.
          templateId:
            updateBansheeRequestInput.templateId === undefined
              ? undefined
              : updateBansheeRequestInput.templateId || null,
        },
      });

      return {
        ...updatedBansheeRequest,
      };
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error(`Error updating banshee request #${id}`, error.stack);
      } else {
        this.logger.error(`Error updating banshee request #${id}`, error);
      }
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUEST_UPDATE_ERROR_GENERIC',
          title: errorTexts.boltResultUpdateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async remove(id: string, user: ActiveUserData): Promise<BansheeRequest> {
    const bansheeRequest = await this.prisma.bansheeRequest.findUnique({
      where: { id },
      include: {
        proceqData: {
          include: { readings: true },
        },
      },
    });

    if (!bansheeRequest) {
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUEST_NOTFOUND_ERROR',
          title: errorTexts.boltResultUpdateError_title,
        },
      });
    }

    if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
      try {
        await this.validateUserCompanyAccess(user, bansheeRequest.companyId);
      } catch {
        throw new ForbiddenException(
          'User does not have access to this banshee request.',
        );
      }
    }
    for (const proceqData of bansheeRequest.proceqData) {
      const hasReadings = proceqData.readings.length > 0;
      const hasLogs = !!proceqData.comments;

      await this.statsService.updateStatsForMeasurement(
        proceqData.createdTimestamp,
        hasReadings,
        hasLogs,
        proceqData.comments || '',
        bansheeRequest.siteId,
        bansheeRequest.companyId,
        'delete',
      );
    }
    try {
      const deletedRequest = await this.prisma.bansheeRequest.delete({
        where: { id },
      });

      return {
        ...deletedRequest,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error deleting banshee request #${id}`, error.stack);
      } else {
        this.logger.error(`Error deleting banshee request #${id}`, error);
      }
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUEST_DELETE_ERROR_GENERIC',
          title: errorTexts.bansheeRequestDeleteError_title,
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
      measured?: boolean;
      levelId?: string;
      period?: number;
      driveId?: string;
      locationId?: string;
      createdBy?: string;
      companyId?: string;
      siteId?: string;
      activateNotifications?: boolean;
      startDate?: Date;
      endDate?: Date;
      isNotMeasurable?: boolean;
      isBrokenBolt?: boolean;
    },
    allowedCompanyIds: string[],
    allowedApps: Application[],
    user: ActiveUserData,
  ): Promise<GraphQLTypes.BansheeRequestResponse> {
    try {
      const { offset = 0, limit = 10, ...restFilters } = filters;

      const { companyId } = filters || {};

      // Extract companyId and check if the user has access to the any of the applications
      if (companyId) {
        const hasAccess = await hasAppAccessForCompany(
          this.prisma,
          user,
          allowedApps,
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

      if (restFilters.measured != null) {
        where.measured = restFilters.measured;
      }

      if (restFilters.period) {
        where.period = restFilters.period;
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

      if (restFilters.isBrokenBolt != null) {
        where.isBrokenBolt = restFilters.isBrokenBolt;
      }

      if (restFilters.isNotMeasurable != null) {
        where.isNotMeasurable = restFilters.isNotMeasurable;
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
      const totalRecords = await this.prisma.bansheeRequest.count({
        where,
      });

      const results = await this.prisma.bansheeRequest.findMany({
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
        this.logger.error('Error fetching banshee requests', error.stack);
      } else {
        this.logger.error('Error fetching banshee requests', error);
      }
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUESTS_FETCH_ERROR',
          title: 'Failed to fetch banshee requests',
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async findOne(id: string, user: ActiveUserData): Promise<BansheeRequest> {
    try {
      const bansheeRequest = await this.prisma.bansheeRequest.findUnique({
        where: { id },
      });

      if (!bansheeRequest) {
        throw new UserInputError('', {
          extensions: {
            code: 'BANSHEE_REQUEST_NOTFOUND_ERROR',
            title: `Banshee request #${id} not found`,
          },
        });
      }

      if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
        try {
          await this.validateUserCompanyAccess(user, bansheeRequest.companyId);
        } catch {
          throw new ForbiddenException(
            'User does not have access to this banshee request.',
          );
        }
      }

      return {
        ...bansheeRequest,
      };
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error(`Error fetching banshee request #${id}`, error.stack);
      } else {
        this.logger.error(`Error fetching banshee request #${id}`, error);
      }
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUEST_FETCH_ERROR',
          title: 'Failed to fetch banshee request',
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async getStatusDistribution(
    filters: {
      companyId?: string;
      siteId?: string;
      locationId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    allowedCompanyIds: string[],
    user: ActiveUserData,
    allowedApps: Application[],
  ): Promise<GraphQLTypes.BansheeStatusDistribution> {
    const { companyId } = filters || {};

    // Extract companyId and check if the user has access to the any of the applications
    if (companyId) {
      const hasAccess = await hasAppAccessForCompany(
        this.prisma,
        user,
        allowedApps,
        companyId,
      );

      if (!hasAccess) {
        throw new ForbiddenException(
          'User missing access to this application for this company.',
        );
      }
    }

    const where: any = {};

    if (filters.companyId) where.companyId = filters.companyId;
    if (filters.siteId) where.siteId = filters.siteId;
    if (filters.locationId) where.locationId = filters.locationId;

    if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
      if (filters.companyId) {
        if (!allowedCompanyIds.includes(filters.companyId)) {
          throw new ForbiddenException(
            'User does not have access to this company.',
          );
        }
      } else {
        where.companyId = { in: allowedCompanyIds };
      }
    }

    const hasDateFilter = filters.startDate && filters.endDate;

    const bansheeRequests = await this.prisma.bansheeRequest.findMany({
      where: {
        ...where,
        ...(hasDateFilter && {
          proceqData: {
            some: {
              updatedTimestamp: {
                gte: filters.startDate,
                lte: filters.endDate,
              },
            },
          },
        }),
      },
      include: {
        site: {
          select: { siteName: true },
        },
        level: {
          select: { levelName: true },
        },
        drive: {
          select: { driveName: true },
        },
        location: {
          select: { locationName: true },
        },
        proceqData: {
          where: hasDateFilter
            ? {
                updatedTimestamp: {
                  gte: filters.startDate,
                  lte: filters.endDate,
                },
              }
            : undefined,
          select: {
            status: true,
            createdTimestamp: true,
            updatedTimestamp: true,
          },
          // Latest session first, ranked the same way the frontend ranks it
          // (see apps/banshee/src/libs/latest-measurement.ts): a session with
          // no updatedTimestamp must never outrank one that has one, and
          // Postgres sorts NULLs first on DESC by default.
          orderBy: [
            { updatedTimestamp: { sort: 'desc', nulls: 'last' } },
            { createdTimestamp: { sort: 'desc', nulls: 'last' } },
          ],
          take: 1,
        },
      },
    });

    const counts: Record<string, number> = {};
    const locationCountsMap: Record<
      string,
      {
        locationName: string;
        siteName: string;
        levelName: string;
        driveName: string;
        total: number;
        counts: Record<string, number>;
        results: BansheeRequest[];
      }
    > = {};

    for (const br of bansheeRequests) {
      const status = br.proceqData[0]?.status ?? ProceqStatus.UNMEASURED;

      counts[status] = (counts[status] || 0) + 1;

      const locId = br.locationId;
      if (!locationCountsMap[locId]) {
        locationCountsMap[locId] = {
          locationName: br.location?.locationName || 'Unknown',
          siteName: br.site?.siteName || 'Unknown',
          levelName: br.level?.levelName || 'Unknown',
          driveName: br.drive?.driveName || 'Unknown',
          total: 0,
          counts: {},
          results: [],
        };
      }

      locationCountsMap[locId].total += 1;
      locationCountsMap[locId].counts[status] =
        (locationCountsMap[locId].counts[status] || 0) + 1;
      locationCountsMap[locId].results.push(br as BansheeRequest);
    }

    return {
      total: bansheeRequests.length,
      statusCounts: Object.entries(counts).map(([status, count]) => ({
        status,
        count,
      })),
      byLocation: Object.entries(locationCountsMap).map(([locId, locData]) => ({
        locationId: locId,
        locationName: locData.locationName,
        siteName: locData.siteName,
        levelName: locData.levelName,
        driveName: locData.driveName,
        total: locData.total,
        statusCounts: Object.entries(locData.counts).map(([status, count]) => ({
          status,
          count,
        })),
        results: locData.results,
      })),
    };
  }

  private async validateUserCompanyAccess(
    user: ActiveUserData,
    companyId: string,
  ): Promise<void> {
    const userPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId: user.id,
        companyId: companyId,
      },
    });

    if (!userPermission) {
      throw new UserInputError('', {
        extensions: {
          code: 'USER_COMPANY_ACCESS_DENIED',
          title: 'User does not have access to the specified company',
        },
      });
    }
  }

  private async validateRelations(
    levelId: string,
    driveId: string,
    locationId: string,
  ): Promise<void> {
    const level = await this.prisma.level.findUnique({
      where: { id: levelId },
    });
    if (!level) {
      throw new UserInputError('', {
        extensions: {
          code: 'LEVEL_NOTFOUND_ERROR',
          title: errorTexts.levelNotFound_title(levelId),
        },
      });
    }

    const drive = await this.prisma.drive.findUnique({
      where: { id: driveId },
      include: { level: true },
    });
    if (!drive) {
      throw new UserInputError('', {
        extensions: {
          code: 'DRIVE_NOTFOUND_ERROR',
          title: errorTexts.driveNotFound_title(driveId),
        },
      });
    }
    if (drive.levelId !== levelId) {
      throw new UserInputError('', {
        extensions: {
          code: 'DRIVE_LEVEL_MISMATCH_ERROR',
          title: 'Drive does not belong to the specified level',
          message:
            'The specified drive does not belong to the specified level.',
        },
      });
    }

    const location = await this.prisma.location.findUnique({
      where: { id: locationId },
      include: { drive: true },
    });
    if (!location) {
      throw new UserInputError('', {
        extensions: {
          code: 'LOCATION_NOTFOUND_ERROR',
          title: errorTexts.locationNotFound_title(locationId),
        },
      });
    }
    if (location.driveId !== driveId) {
      throw new UserInputError('', {
        extensions: {
          code: 'LOCATION_DRIVE_MISMATCH_ERROR',
          title: 'Location does not belong to the specified drive',
          message:
            'The specified location does not belong to the specified drive.',
        },
      });
    }
  }

  //TODO: This solution is temporary and not scalable. A better solution will be needed to do in the future where we store images in a cloud service.
  private async saveImage(upload: GraphQLTypes.Upload): Promise<string> {
    const fileUpload = await upload;
    const { createReadStream, filename, mimetype } = fileUpload.file;

    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(mimetype)) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVALID_FILE_TYPE_ERROR',
          title: 'Invalid file type',
          message: 'Only JPG, JPEG, PNG, and WebP files are allowed.',
        },
      });
    }

    const fileExtension = extname(filename).toLowerCase();
    const timestamp = Date.now();
    const randomPart = randomBytes(8).toString('hex');
    const safeFilename = `${timestamp}-${randomPart}${fileExtension}`;

    const uploadDir = join(process.cwd(), 'uploads', 'bansheeRequests');
    const filePath = join(uploadDir, safeFilename);

    await fs.mkdir(uploadDir, { recursive: true });

    await new Promise<void>((resolve, reject) => {
      const stream = createReadStream();
      const writeStream = createWriteStream(filePath);
      let fileSize = 0;

      const maxFileSize = 10 * 1024 * 1024; // 10MB

      stream.on('data', (chunk: Buffer) => {
        fileSize += chunk.length;
        if (fileSize > maxFileSize) {
          stream.destroy();
          writeStream.destroy();
          fs.unlink(filePath).catch(() => {});
          reject(
            new UserInputError('', {
              extensions: {
                code: 'FILE_SIZE_EXCEEDED_ERROR',
                title: 'File size too large',
                message: `File size exceeds maximum allowed size of ${maxFileSize / (1024 * 1024)}MB`,
              },
            }),
          );
        }
      });

      stream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      stream.on('error', reject);
    });

    return `/uploads/bansheeRequests/${safeFilename}`;
  }

  async getEventLogs(
    filters: {
      offset?: number;
      limit?: number;
      companyId?: string;
      siteId?: string;
    },
    allowedCompanyIds: string[],
    user: ActiveUserData,
    allowedApps: Application[],
  ): Promise<GraphQLTypes.BansheeEventLogResponse> {
    try {
      const { offset = 0, limit = 100, companyId, siteId } = filters;

      // Extract companyId and check if the user has access to the any of the applications
      if (companyId) {
        const hasAccess = await hasAppAccessForCompany(
          this.prisma,
          user,
          allowedApps,
          companyId,
        );

        if (!hasAccess) {
          throw new ForbiddenException(
            'User missing access to this application for this company.',
          );
        }
      }

      const where: any = {};

      const bansheeRequestWhere: any = {};

      // Apply company access filter for non-admin users
      if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
        if (companyId) {
          if (!allowedCompanyIds.includes(companyId)) {
            throw new ForbiddenException(
              'User does not have access to this company.',
            );
          }
          bansheeRequestWhere.companyId = companyId;
        } else {
          bansheeRequestWhere.companyId = { in: allowedCompanyIds };
        }
      } else {
        if (companyId) bansheeRequestWhere.companyId = companyId;
      }

      if (siteId) bansheeRequestWhere.siteId = siteId;

      if (Object.keys(bansheeRequestWhere).length > 0) {
        where.bansheeRequest = bansheeRequestWhere;
      }

      const totalRecords = await this.prisma.bansheeEventLog.count({
        where,
      });

      const results = await this.prisma.bansheeEventLog.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          bansheeRequest: {
            include: {
              location: true,
            },
          },
        },
      });

      return {
        totalRecords,
        results: results as unknown as GraphQLTypes.BansheeEventLog[],
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error fetching event logs', error.stack);
      } else {
        this.logger.error('Error fetching event logs', error);
      }
      throw new UserInputError('', {
        extensions: {
          code: 'EVENT_LOGS_FETCH_ERROR',
          title: 'Failed to fetch event logs',
          message: errorTexts.contactSupportError,
        },
      });
    }
  }
}
