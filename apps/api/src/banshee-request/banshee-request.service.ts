import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { extname, join } from 'path';
import { createWriteStream } from 'fs';
import { promises as fs } from 'fs';
import { randomBytes } from 'crypto';
import { BoltType, RingPosition } from '@prisma/client';

@Injectable()
export class BansheeRequestsService {
  private readonly logger = new Logger(BansheeRequestsService.name);

  constructor(private prisma: PrismaService) {}

  async create(
    createBansheeRequestInput: GraphQLTypes.CreateBansheeRequestInput,
    user: ActiveUserData,
  ): Promise<any> {
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

      // await this.validateUserCompanyAccess(user, createBansheeRequestInput.companyId);
      
      await this.validateRelations(
        createBansheeRequestInput.levelId,
        createBansheeRequestInput.driveId,
        createBansheeRequestInput.locationId,
      );

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

      const createdBansheeRequest = await this.prisma.bansheeRequest.create({
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
          ringPosition: createBansheeRequestInput.ringPosition as RingPosition || undefined,
          comment: createBansheeRequestInput.comment || undefined,
          isBrokenBolt: createBansheeRequestInput.isBrokenBolt,
          isNotMeasurable: createBansheeRequestInput.isNotMeasurable,
          images: imagePaths ? JSON.stringify(imagePaths) : undefined,
          boltType: createBansheeRequestInput.boltType as BoltType,
          createdBy: user.id,
          updatedBy: user.id,
          companyId: createBansheeRequestInput.companyId,
          siteId: createBansheeRequestInput.siteId,
        },
        include: {
          level: true,
          drive: true,
          location: true,
          company: true,
          site: true,
          deviceAndMeasurements: { include: { readings: true } },
          eventLogs: true,
        },
      });

      if (!createdBansheeRequest) {
        throw new UserInputError('', {
          extensions: {
            code: 'BANSHEE_REQUEST_CREATION_ERROR',
            title:
              errorTexts.createBansheeRequestInputResultCreationError_title,
          },
        });
      }

      let imagesArray: string[] | undefined;
      if (createdBansheeRequest.images) {
        try {
          imagesArray = JSON.parse(createdBansheeRequest.images as string);
        } catch (e) {
          imagesArray = undefined;
        }
      }

      return {
        ...createdBansheeRequest,
        images: imagesArray,
        boltType: createBansheeRequestInput.boltType || undefined,
      };
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      this.logger.error('Error creating banshee request', error.stack);
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUEST_CREATION_ERROR_GENERIC',
          title: errorTexts.createBansheeRequestInputResultCreationError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  // measured fieled updtae in same table
  async update(
    id: string,
    updateBansheeRequestInput: GraphQLTypes.UpdateBansheeRequestInput,
    user: ActiveUserData,
  ): Promise<any> {
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

      // Validate company access if companyId is being updated
      if (updateBansheeRequestInput.companyId) {
        await this.validateUserCompanyAccess(user, updateBansheeRequestInput.companyId);
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

      let imagePaths: string[] | undefined;
      if (
        updateBansheeRequestInput.images &&
        updateBansheeRequestInput.images.length > 0
      ) {
        imagePaths = [];
        for (const image of updateBansheeRequestInput.images) {
          const imagePath = await this.saveImage(image);
          imagePaths.push(imagePath);
        }
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
          locationDetails:
            updateBansheeRequestInput.locationDetails || undefined,
          boltInstallationDateTime:
            updateBansheeRequestInput.boltInstallationDateTime || undefined,
          ringPosition: updateBansheeRequestInput.ringPosition as RingPosition || undefined,
          comment: updateBansheeRequestInput.comment || undefined,
          isBrokenBolt: updateBansheeRequestInput.isBrokenBolt ?? undefined,
          isNotMeasurable:
            updateBansheeRequestInput.isNotMeasurable ?? undefined,
          images: imagePaths ? JSON.stringify(imagePaths) : undefined,
          updatedBy: user.id,
          measured: updateBansheeRequestInput.measured ?? undefined,
          siteId: updateBansheeRequestInput.siteId || undefined,
        },
        include: {
          level: true,
          drive: true,
          location: true,
          company: true,
          site: true,
          deviceAndMeasurements: { include: { readings: true } },
          eventLogs: true,
        },
      });

      let imagesArray: string[] | undefined;
      if (updatedBansheeRequest.images) {
        try {
          imagesArray = JSON.parse(updatedBansheeRequest.images as string);
        } catch (e) {
          imagesArray = undefined;
        }
      }

      return {
        ...updatedBansheeRequest,
        images: imagesArray,
        boltType: updateBansheeRequestInput.boltType || undefined,
      };
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      this.logger.error(`Error updating banshee request #${id}`, error.stack);
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUEST_UPDATE_ERROR_GENERIC',
          title: errorTexts.boltResultUpdateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async remove(id: string): Promise<any> {
    const bansheeRequest = await this.prisma.bansheeRequest.findUnique({
      where: { id },
      include: {
        level: true,
        drive: true,
        location: true,
        company: true,
        site: true,
        deviceAndMeasurements: { include: { readings: true } },
        eventLogs: true,
      },
    });

    if (!bansheeRequest) {
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUEST_NOTFOUND_ERROR',
          title: `Banshee request #${id} not found`,
        },
      });
    }

    try {
      const deletedRequest = await this.prisma.bansheeRequest.delete({
        where: { id },
        include: {
          level: true,
          drive: true,
          location: true,
          company: true,
          site: true,
          deviceAndMeasurements: { include: { readings: true } },
          eventLogs: true,
        },
      });

      let imagesArray: string[] | undefined;
      if (deletedRequest.images) {
        try {
          imagesArray = JSON.parse(deletedRequest.images as string);
        } catch (e) {
          // If parsing fails, set to undefined
          imagesArray = undefined;
        }
      }

      return {
        ...deletedRequest,
        images: imagesArray,
        boltType: undefined,
      };
    } catch (error) {
      this.logger.error(`Error deleting banshee request #${id}`, error.stack);
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUEST_DELETE_ERROR_GENERIC',
          title: errorTexts.boltResultDeleteError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }
  async findAll(filters: {
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
    timeFilter?: string;
  }): Promise<any> {
    try {
      const { offset = 0, limit = 10, ...restFilters } = filters;

      const where: any = {};

      if (restFilters.serialNumber) {
        where.serialNumber = {
          contains: restFilters.serialNumber,
          mode: 'insensitive',
        };
      }

      if (restFilters.measured) {
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
    
      if (restFilters.timeFilter && restFilters.timeFilter !== 'ALL' && restFilters.companyId && restFilters.siteId) {
        const dateRange = await this.getDateRangeFromTimeFilter(restFilters.companyId, restFilters.siteId, restFilters.timeFilter);
        if (dateRange) {
          where.deviceAndMeasurements = {
            some: {
              updatedTimestamp: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
              }
            }
          };
        }
      }

      const totalRecords = await this.prisma.bansheeRequest.count({
        where,
      });

      const bansheeRequests = await this.prisma.bansheeRequest.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          level: true,
          drive: true,
          location: true,
          company: true,
          site: true,
          deviceAndMeasurements: { include: { readings: true } },
          eventLogs: true,
        },
      });

      // Transform images for each request
      const results = bansheeRequests.map((request) => {
        let imagesArray: string[] | undefined;
        if (request.images) {
          try {
            imagesArray = JSON.parse(request.images as string);
          } catch (e) {
            imagesArray = undefined;
          }
        }

        return {
          ...request,
          images: imagesArray,
          boltType: undefined,
        };
      });

      return {
        totalRecords,
        results,
      };
    } catch (error) {
      this.logger.error('Error fetching banshee requests', error.stack);
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUESTS_FETCH_ERROR',
          title: 'Failed to fetch banshee requests',
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const bansheeRequest = await this.prisma.bansheeRequest.findUnique({
        where: { id },
        include: {
          level: true,
          drive: true,
          location: true,
          company: true,
          site: true,
          deviceAndMeasurements: { include: { readings: true } },
          eventLogs: true,
        },
      });

      if (!bansheeRequest) {
        throw new UserInputError('', {
          extensions: {
            code: 'BANSHEE_REQUEST_NOTFOUND_ERROR',
            title: `Banshee request #${id} not found`,
          },
        });
      }

      // Transform images from JSON string to array
      let imagesArray: string[] | undefined;
      if (bansheeRequest.images) {
        try {
          imagesArray = JSON.parse(bansheeRequest.images as string);
        } catch (e) {
          imagesArray = undefined;
        }
      }

      return {
        ...bansheeRequest,
        images: imagesArray,
        boltType: undefined,
      };
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      this.logger.error(`Error fetching banshee request #${id}`, error.stack);
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_REQUEST_FETCH_ERROR',
          title: 'Failed to fetch banshee request',
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async getStatusDistribution(filters: { companyId?: string; siteId?: string; locationId?: string; timeFilter?: string }): Promise<GraphQLTypes.BansheeStatusDistribution> {
    const where: any = {};
    if (filters.companyId) where.companyId = filters.companyId;
    if (filters.siteId) where.siteId = filters.siteId;
    if (filters.locationId) where.locationId = filters.locationId;

    if (filters.timeFilter && filters.timeFilter !== 'ALL' && filters.companyId && filters.siteId) {
      const dateRange = await this.getDateRangeFromTimeFilter(filters.companyId, filters.siteId, filters.timeFilter);
      if (dateRange) {
        where.deviceAndMeasurements = {
          some: {
            createdTimestamp: {
              gte: dateRange.startDate,
              lte: dateRange.endDate,
            }
          }
        };
      }
    }

    const bansheeRequests = await this.prisma.bansheeRequest.findMany({
      where,
      select: {
        id: true,
        locationId: true,
        location: {
          select: { locationName: true }
        },
        deviceAndMeasurements: {
          select: { status: true, createdTimestamp: true },
          orderBy: { createdTimestamp: 'desc' },
          take: 1,
        },
      },
    });

    const counts: Record<string, number> = {};
    const locationCountsMap: Record<string, { locationName: string; total: number; counts: Record<string, number> }> = {};

    for (const br of bansheeRequests) {
      const status = br.deviceAndMeasurements[0]?.status ?? 'unmeasured';
      counts[status] = (counts[status] || 0) + 1;

      const locId = br.locationId;
      if (!locationCountsMap[locId]) {
        locationCountsMap[locId] = {
          locationName: br.location?.locationName || 'Unknown',
          total: 0,
          counts: {}
        };
      }
      locationCountsMap[locId].total += 1;
      locationCountsMap[locId].counts[status] = (locationCountsMap[locId].counts[status] || 0) + 1;
    }

    return {
      total: bansheeRequests.length,
      statusCounts: Object.entries(counts).map(([status, count]) => ({ status, count })),
      byLocation: Object.entries(locationCountsMap).map(([locId, locData]) => ({
        locationId: locId,
        locationName: locData.locationName,
        total: locData.total,
        statusCounts: Object.entries(locData.counts).map(([status, count]) => ({ status, count }))
      }))
    };
  }

  private async getDateRangeFromTimeFilter(companyId: string, siteId: string, timeFilter: string) {
    if (!timeFilter || timeFilter === 'ALL') return null;

    const latestRecord = await this.prisma.proceqData.findFirst({
      where: { bansheeRequest: { companyId, siteId } },
      orderBy: { updatedTimestamp: 'desc' },
      select: { updatedTimestamp: true }
    });
    this.logger.log('Vasu latest records', latestRecord);
    if (!latestRecord?.updatedTimestamp) return null;

    const endDate = new Date(latestRecord.updatedTimestamp);
    const startDate = new Date(latestRecord.updatedTimestamp);

    switch (timeFilter) {
      case '7D': startDate.setDate(endDate.getDate() - 7); break;
      case '1M': startDate.setMonth(endDate.getMonth() - 1); break;
      case '3M': startDate.setMonth(endDate.getMonth() - 3); break;
      case '1Y': startDate.setFullYear(endDate.getFullYear() - 1); break;
    }
    this.logger.log('Vasu start and end date', startDate, endDate);
    return { startDate, endDate };
  }

  private async validateUserCompanyAccess(user: ActiveUserData, companyId: string): Promise<void> {
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
    // Validate level exists
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

    // Validate drive exists and belongs to the level
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

  async getEventLogs(filters: {
    offset?: number;
    limit?: number;
    companyId?: string;
    siteId?: string;
  }): Promise<GraphQLTypes.BansheeEventLogResponse> {
    try {
      const { offset = 0, limit = 100, companyId, siteId } = filters;

      const where: any = {};
      
      const bansheeRequestWhere: any = {};
      if (companyId) bansheeRequestWhere.companyId = companyId;
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
            }
          }
        }
      });

      return {
        totalRecords,
        results: results as unknown as GraphQLTypes.BansheeEventLog[],
      };
    } catch (error) {
      this.logger.error('Error fetching event logs', error.stack);
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