import { Injectable } from '@nestjs/common';
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
@Injectable()
export class BoltResultsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    skip: number,
    take: number,
    user: ActiveUserData,
    filters?: {
      siteId?: string;
      levelId?: string;
      driveId?: string;
      locationId?: string;
    },
  ): Promise<BoltResultResponse> {
    const whereCondition: Record<string, any> = {
      ...(user.globalRole === 'SANDVIK_TECHNICIAN' ? { userId: user.sub } : {}),
      ...(filters &&
        Object.fromEntries(
          Object.entries(filters).filter(([, value]) => Boolean(value)),
        )),
    };

    console.log(
      'User:',
      user,
      'Filters:',
      filters,
      'WhereCondition:',
      whereCondition,
    );

    // Get total count of matching records
    const totalRecords = await this.prisma.boltResult.count({
      where: whereCondition,
    });

    // Get paginated results
    const results = await this.prisma.boltResult.findMany({
      skip,
      take,
      where: whereCondition,
    });

    console.log(results, 'results', totalRecords, 'totalRecords');
    return { totalRecords, results };
  }

  // async findAll(
  //   skip: number,
  //   take: number,
  //   user: ActiveUserData,
  //   filters?: {
  //     siteId?: string;
  //     levelId?: string;
  //     driveId?: string;
  //     locationId?: string;
  //   },
  // ): Promise<BoltResult[]> {
  //   // Define whereCondition as a constant
  //   const whereCondition: Record<string, any> = {
  //     ...(user.globalRole === 'SANDVIK_TECHNICIAN' ? { userId: user.sub } : {}),
  //     ...(filters &&
  //       Object.fromEntries(
  //         Object.entries(filters).filter(([, value]) => Boolean(value)), // Fix: Removed `_`
  //       )),
  //   };

  //   console.log(
  //     'User:',
  //     user,
  //     'Filters:',
  //     filters,
  //     'WhereCondition:',
  //     whereCondition,
  //   );

  //   return this.prisma.boltResult.findMany({
  //     skip,
  //     take,
  //     where: whereCondition,
  //   });
  // }

  async findOne(id: string): Promise<BoltResult> {
    const boltResult = await this.prisma.boltResult.findUnique({
      where: { id },
    });
    if (!boltResult) {
      throw new UserInputError(`BoltResult #${id} not found`);
    }
    return boltResult;
  }

  async create(
    createBoltResultInput: GraphQLTypes.CreateBoltResultInput,
  ): Promise<BoltResult> {
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
        image: createBoltResultInput.image || undefined,

        siteId: createBoltResultInput.siteId,
        levelId: createBoltResultInput.levelId,
        driveId: createBoltResultInput.driveId,
        locationId: createBoltResultInput.locationId,
        userId: createBoltResultInput.userId,
      },
    });

    if (!createdBoltResult) {
      throw new UserInputError('Failed to create boltResult');
    }
    return createdBoltResult;
  }

  async update(
    id: string,
    updateBoltResultInput: GraphQLTypes.UpdateBoltResultInput,
  ): Promise<BoltResult> {
    const updatedBoltResult = await this.prisma.boltResult.update({
      where: { id },

      data: {
        boltNumber: updateBoltResultInput?.boltNumber || undefined,
        boltType: (updateBoltResultInput?.boltType as BoltType) || undefined,
        peakLoad: updateBoltResultInput?.peakLoad || undefined,
        peakDisplacement: updateBoltResultInput?.peakDisplacement || undefined,
        positionInRing:
          (updateBoltResultInput?.positionInRing as RingPosition) || undefined,
        result: (updateBoltResultInput?.result as Result) || undefined,
        isHazard: updateBoltResultInput?.isHazard || undefined,
        hazardCompletedDate:
          updateBoltResultInput?.hazardCompletedDate || undefined,
        abortReason:
          (updateBoltResultInput?.abortReason as PullTestAbortReason) ||
          undefined,
        comment: updateBoltResultInput?.comment || undefined,
        image: updateBoltResultInput?.image || undefined,
      },
    });

    if (!updatedBoltResult) {
      throw new UserInputError(`BoltResult #${id} not found`);
    }
    return updatedBoltResult;
  }

  async remove(id: string): Promise<BoltResult> {
    const boltResult = await this.prisma.boltResult.delete({ where: { id } });
    if (!boltResult) {
      throw new UserInputError(`BoltResult #${id} not found`);
    }
    return boltResult;
  }
}
