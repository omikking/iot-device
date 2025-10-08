import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  BoltResult,
  Result,
  PullTestAbortReason,
  BoltType,
  RingPosition,
  GlobalRole,
  Application,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { UpdateBoltResultInput } from './dto/update-boltResult.input';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { hasAppAccessForCompany } from 'src/utils';
import { extname, join } from 'path';
import { createWriteStream } from 'fs';
import { promises as fs } from 'fs';
import { randomBytes } from 'crypto';

@Injectable()
export class BoltResultsService {
  constructor(private prisma: PrismaService) {}

  async findMany(
    user: ActiveUserData,
    pagination: { offset?: number; limit?: number },
    filters: {
      siteId?: string | undefined;
      levelId?: string | undefined;
      driveId?: string | undefined;
      locationId?: string | undefined;
      result?: string[] | undefined;
      isHazard?: boolean | undefined;
      withImage?: boolean | undefined;
      withComment?: boolean | undefined;
      startDate?: Date | undefined;
      endDate?: Date | undefined;
    },
    allowedCompanyIds: string[],
    allowedApps: Application[],
  ): Promise<GraphQLTypes.BoltResultResponse> {
    const { offset, limit } = pagination;

    const {
      siteId,
      levelId,
      driveId,
      locationId,
      result,
      isHazard,
      withImage,
      withComment,
      startDate,
      endDate,
    } = filters || {};

    // Extract companyId and check if the user has access to the any of the applications
    if (siteId) {
      const site = await this.prisma.site.findUnique({
        where: { id: siteId },
        select: { companyId: true },
      });
      const companyId = site?.companyId;

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

    const whereCondition: Record<string, any> = {
      // Only return results for companies the user has permission for
      ...(user.globalRole !== GlobalRole.SANDVIK_ADMIN
        ? { site: { companyId: { in: allowedCompanyIds } } }
        : {}),
      ...(siteId ? { siteId } : {}),
      ...(levelId ? { levelId } : {}),
      ...(driveId ? { driveId } : {}),
      ...(locationId ? { locationId } : {}),
      ...(result && result.length ? { result: { in: result } } : {}),
      ...(typeof isHazard === 'boolean' ? { isHazard } : {}),
      ...(withImage === true ? { image: { not: null } } : {}),
      ...(withComment === true ? { comment: { not: null } } : {}),
      ...(startDate && endDate
        ? {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {}),
    };

    const totalRecords = await this.prisma.boltResult.count({
      where: whereCondition,
    });

    const failedCount = await this.prisma.boltResult.count({
      where: {
        ...whereCondition,
        result: 'FAIL',
      },
    });

    const hazardCount = await this.prisma.boltResult.count({
      where: {
        ...whereCondition,
        isHazard: true,
      },
    });

    const passedCount = await this.prisma.boltResult.count({
      where: {
        ...whereCondition,
        result: 'PASS',
      },
    });

    const queryOptions: any = {
      where: whereCondition,
      include: {
        site: true,
        level: true,
        drive: true,
        location: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    if (typeof offset === 'number') {
      queryOptions.skip = offset;
    }

    if (typeof limit === 'number') {
      queryOptions.take = limit;
    }

    const results = await this.prisma.boltResult.findMany(queryOptions);

    const allResultsForAverage = await this.prisma.boltResult.findMany({
      where: whereCondition,
      select: {
        peakLoad: true,
      },
    });

    let averageTons: number | null = null;
    if (allResultsForAverage.length > 0) {
      const allPeakLoads = allResultsForAverage
        .map((result) => result.peakLoad)
        .flat()
        .filter((load) => load !== null && load !== undefined);

      if (allPeakLoads.length > 0) {
        const sum = allPeakLoads.reduce((acc, load) => acc + load, 0);
        averageTons = Math.round(sum / allPeakLoads.length);
      }
    }

    return {
      totalRecords,
      results,
      failedCount,
      passedCount,
      hazardCount,
      averageTons,
    };
  }

  async findOne(id: string): Promise<BoltResult> {
    const boltResult = await this.prisma.boltResult.findUnique({
      where: { id },
    });
    if (!boltResult) {
      throw new UserInputError('', {
        extensions: {
          code: 'BOLT_RESULT_NOTFOUND_ERROR',
          title: errorTexts.boltResultNotFound_title(id),
        },
      });
    }
    return boltResult;
  }

  async create(
    createBoltResultInput: GraphQLTypes.CreateBoltResultInput,
  ): Promise<BoltResult> {
    try {
      let imagePath: string | undefined;

      if (createBoltResultInput.image) {
        imagePath = await this.saveImage(createBoltResultInput.image);
      }

      const createdBoltResult = await this.prisma.boltResult.create({
        data: {
          boltNumber: createBoltResultInput.boltNumber,
          boltType: createBoltResultInput.boltType as BoltType,
          peakLoad: createBoltResultInput.peakLoad,
          peakDisplacement: createBoltResultInput.peakDisplacement,
          positionInRing: createBoltResultInput.positionInRing as RingPosition,
          result: createBoltResultInput.result as Result,
          isHazard: createBoltResultInput.isHazard,
          abortReason:
            (createBoltResultInput.abortReason as PullTestAbortReason) ||
            undefined,
          comment: createBoltResultInput.comment || undefined,
          image: imagePath || undefined,
          siteId: createBoltResultInput.siteId,
          levelId: createBoltResultInput.levelId,
          driveId: createBoltResultInput.driveId,
          locationId: createBoltResultInput.locationId,
          userId: createBoltResultInput.userId,
        },
      });

      if (!createdBoltResult) {
        throw new UserInputError('', {
          extensions: {
            code: 'BOLT_RESULT_CREATION_ERROR',
            title: errorTexts.boltResultCreationError_title,
          },
        });
      }
      return createdBoltResult;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'BOLT_RESULT_CREATION_ERROR_GENERIC',
          title: errorTexts.boltResultCreationError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async update(
    id: string,
    updateBoltResultInput: GraphQLTypes.UpdateBoltResultInput,
  ): Promise<BoltResult> {
    try {
      const updatedBoltResult = await this.prisma.boltResult.update({
        where: { id },

        data: {
          boltNumber: updateBoltResultInput?.boltNumber || undefined,
          boltType: (updateBoltResultInput?.boltType as BoltType) || undefined,
          peakLoad: updateBoltResultInput?.peakLoad || undefined,
          peakDisplacement:
            updateBoltResultInput?.peakDisplacement || undefined,
          positionInRing:
            (updateBoltResultInput?.positionInRing as RingPosition) ||
            undefined,
          result: (updateBoltResultInput?.result as Result) || undefined,
          isHazard: updateBoltResultInput?.isHazard ?? undefined,
          hazardCompletedDate:
            updateBoltResultInput?.hazardCompletedDate ?? undefined,
          abortReason:
            (updateBoltResultInput?.abortReason as PullTestAbortReason) ||
            undefined,
          comment: updateBoltResultInput?.comment || undefined,
          image: updateBoltResultInput?.image || undefined,
        },
      });

      if (updateBoltResultInput?.hazardCompletedDate && !updatedBoltResult) {
        throw new UserInputError('', {
          extensions: {
            code: 'BOLT_RESULT_HAZARD_COMPLETION_ERROR',
            title: errorTexts.boltResultHazardCompletionError_title,
            message: errorTexts.contactSupportError,
          },
        });
      }

      return updatedBoltResult;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'BOLT_RESULT_UPDATE_ERROR_GENERIC',
          title: errorTexts.boltResultUpdateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async remove(id: string): Promise<BoltResult> {
    const boltResult = await this.prisma.boltResult.findUnique({
      where: { id },
    });

    if (!boltResult) {
      throw new UserInputError('', {
        extensions: {
          code: 'BOLT_RESULT_NOTFOUND_ERROR',
          title: errorTexts.boltResultNotFound_title(id),
        },
      });
    }

    try {
      return await this.prisma.boltResult.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'BOLT_RESULT_DELETE_ERROR_GENERIC',
          title: errorTexts.boltResultDeleteError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async createBulk(
    createBoltResultsInput: GraphQLTypes.CreateBoltResultInput[],
    siteId: string,
  ): Promise<BoltResult[]> {
    if (!createBoltResultsInput?.length) {
      throw new UserInputError('', {
        extensions: {
          code: 'BOLT_RESULT_REQUIRED_ERROR',
          title: errorTexts.boltResultRequired_title,
          message: errorTexts.boltResultRequired_message,
        },
      });
    }

    const allMatch = createBoltResultsInput.every((i) => i.siteId === siteId);
    if (!allMatch) {
      throw new UserInputError('', {
        extensions: {
          code: 'BOLT_RESULT_SITEID_MISMATCH_ERROR',
          title: errorTexts.boltResultSiteIdMismatch_title,
          message: errorTexts.boltResultSiteIdMismatch_message,
        },
      });
    }

    // Transform data before insertion for better readability and maintainability
    const boltResultsData = await Promise.all(
      createBoltResultsInput.map(async (input) => {
        let imagePath: string | undefined;

        if (input.image) {
          imagePath = await this.saveImage(input.image);
        }

        return {
          boltNumber: input.boltNumber,
          boltType: input.boltType as BoltType,
          peakLoad: input.peakLoad,
          peakDisplacement: input.peakDisplacement,
          positionInRing: input.positionInRing as RingPosition,
          result: input.result as Result,
          isHazard: input.isHazard,
          abortReason: input.abortReason as PullTestAbortReason | undefined,
          comment: input.comment || undefined,
          image: imagePath || undefined,
          siteId: input.siteId,
          levelId: input.levelId,
          driveId: input.driveId,
          locationId: input.locationId,
          userId: input.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    );

    // Perform bulk insertion
    await this.prisma.boltResult.createMany({
      data: boltResultsData,
      skipDuplicates: true, // Avoid inserting duplicate records
    });

    // Fetch only the newly inserted records using the latest `createdAt`
    return this.prisma.boltResult.findMany({
      where: {
        userId: boltResultsData[0].userId, // Filter by user to limit scope
        createdAt: {
          gte: new Date(
            Math.min(...boltResultsData.map((d) => d.createdAt.getTime())),
          ),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateBulk(
    updateBoltResultsInput: UpdateBoltResultInput[],
  ): Promise<BoltResult[]> {
    if (!updateBoltResultsInput.length) {
      throw new UserInputError('', {
        extensions: {
          code: 'BOLT_RESULTS_NOUPDATES_ERROR',
          title: errorTexts.boltResultsNoUpdates_title,
          message: errorTexts.boltResultsNoUpdates_message,
        },
      });
    }

    // Validate that every object in the array has an `id`
    updateBoltResultsInput.forEach((input) => {
      if (!input.id) {
        throw new UserInputError('', {
          extensions: {
            code: 'BOLT_RESULTS_IDMISSING_ERROR',
            title: errorTexts.boltResultsIdMissing_title,
            message: errorTexts.boltResultsIdMissing_message,
          },
        });
      }
    });

    const updatesWithImages = await Promise.all(
      updateBoltResultsInput.map(async (updateInput) => {
        const { image, ...rest } = updateInput;

        let imagePath: string | undefined;
        if (image) {
          imagePath = await this.saveImage(image);
        }

        return {
          ...rest,
          imagePath,
        };
      }),
    );

    const updatePromises = updatesWithImages.map((updateInput) => {
      const {
        id,
        boltType,
        positionInRing,
        result,
        abortReason,
        imagePath,
        ...updateData
      } = updateInput;

      return this.prisma.boltResult.update({
        where: { id },
        data: {
          ...updateData,
          boltType: boltType ? (boltType as BoltType) : undefined,
          positionInRing: positionInRing
            ? (positionInRing as RingPosition)
            : undefined,
          result: result ? (result as Result) : undefined,
          abortReason: abortReason
            ? (abortReason as PullTestAbortReason)
            : undefined,
          image: imagePath || undefined,
          updatedAt: new Date(),
        },
      });
    });

    return this.prisma.$transaction(updatePromises);
  }

  async removeBulk(ids: string[]): Promise<BoltResult[]> {
    if (!ids.length) {
      throw new UserInputError('', {
        extensions: {
          code: 'BOLT_RESULTS_IDREQUIRED_ERROR',
          title: errorTexts.boltResultsIdRequired_title,
          message: errorTexts.boltResultsIdRequired_message,
        },
      });
    }

    // Fetch records before deletion for returning the response
    const deletedResults = await this.prisma.boltResult.findMany({
      where: { id: { in: ids } },
    });

    if (!deletedResults.length) {
      throw new UserInputError('', {
        extensions: {
          code: 'BOLT_RESULTS_NOTFOUND_ERROR',
          title: errorTexts.boltResultsNotFoundError_title,
          message: errorTexts.boltResultsNotFoundError_message,
        },
      });
    }

    await this.prisma.boltResult.deleteMany({
      where: { id: { in: ids } },
    });

    return deletedResults;
  }

  // This function saved the images on the uploads/boltResults folder and returns the path to be stored in the database.
  // This solution is temporary and not scalable. A better solution will be needed to do in the future where we store images in a cloud service.
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

    const uploadDir = join(process.cwd(), 'uploads', 'boltResults');
    const filePath = join(uploadDir, safeFilename);

    await fs.mkdir(uploadDir, { recursive: true });

    // Save file with error handling and file size validation
    await new Promise<void>((resolve, reject) => {
      const stream = createReadStream();
      const writeStream = createWriteStream(filePath);
      let fileSize = 0;

      const maxFileSize = 5 * 1024 * 1024; // 5MB

      // Check file size
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

    return `/uploads/boltResults/${safeFilename}`;
  }
}
