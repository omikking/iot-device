import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BoltResult,
  Result,
  PullTestAbortReason,
  BoltType,
  RingPosition,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { BoltResultResponse } from './BoltResultResponse';
import { UpdateBoltResultInput } from './dto/update-boltResult.input';

@Injectable()
export class BoltResultsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    user: ActiveUserData,
    skip: number,
    take: number,
    filters?: {
      siteId?: string;
      levelId?: string;
      driveId?: string;
      locationId?: string;
      result?: string;
      isHazard?: boolean;
    },
  ): Promise<BoltResultResponse> {
    const whereCondition: Record<string, any> = {
      ...(user.globalRole === 'SANDVIK_TECHNICIAN' ? { userId: user.id } : {}),
      ...(filters &&
        Object.fromEntries(
          Object.entries(filters).filter(
            ([, value]) => value !== undefined && value !== null,
          ),
        )),
    };

    console.log(whereCondition, 'whereCondition');

    const totalRecords = await this.prisma.boltResult.count({
      where: whereCondition,
    });

    const results = await this.prisma.boltResult.findMany({
      skip: Number(skip), // Ensure it's a number
      take: Number(take), // Ensure it's a number
      where: whereCondition,
    });

    return { totalRecords, results };
  }

  async findOne(id: string): Promise<BoltResult> {
    const boltResult = await this.prisma.boltResult.findUnique({
      where: { id },
    });
    if (!boltResult) {
      throw new UserInputError(`BoltResult #${id} not found`);
    }
    return boltResult;
  }
  async createBulk(
    createBoltResultsInput: GraphQLTypes.CreateBoltResultInput[],
  ): Promise<BoltResult[]> {
    if (!createBoltResultsInput?.length) {
      throw new BadRequestException('At least one bolt result is required.');
    }

    // Transform data before insertion for better readability and maintainability
    const boltResultsData = createBoltResultsInput.map((input) => ({
      boltNumber: input.boltNumber,
      boltType: input.boltType as BoltType,
      peakLoad: input.peakLoad,
      peakDisplacement: input.peakDisplacement,
      positionInRing: input.positionInRing as RingPosition,
      result: input.result as Result,
      isHazard: input.isHazard,
      abortReason: input.abortReason as PullTestAbortReason | undefined,
      comment: input.comment || undefined,
      image: input.image || undefined,
      siteId: input.siteId,
      levelId: input.levelId,
      driveId: input.driveId,
      locationId: input.locationId,
      userId: input.userId,
      createdAt: new Date(), // Ensure timestamps are consistent
      updatedAt: new Date(),
    }));

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
      throw new BadRequestException('No updates provided.');
    }

    // Validate that every object in the array has an `id`
    updateBoltResultsInput.forEach((input) => {
      if (!input.id) {
        throw new BadRequestException(`Missing 'id' in update input.`);
      }
    });

    const updatePromises = updateBoltResultsInput.map((updateInput) => {
      const {
        id,
        boltType,
        positionInRing,
        result,
        abortReason,
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
          updatedAt: new Date(),
        },
      });
    });

    return this.prisma.$transaction(updatePromises);
  }

  async removeBulk(ids: string[]): Promise<BoltResult[]> {
    if (!ids.length) {
      throw new BadRequestException('No IDs provided for deletion.');
    }

    // Fetch records before deletion for returning the response
    const deletedResults = await this.prisma.boltResult.findMany({
      where: { id: { in: ids } },
    });

    if (!deletedResults.length) {
      throw new UserInputError(
        `No matching BoltResults found for provided IDs.`,
      );
    }

    await this.prisma.boltResult.deleteMany({
      where: { id: { in: ids } },
    });

    return deletedResults;
  }
}
