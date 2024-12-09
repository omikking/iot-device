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

@Injectable()
export class BoltResultsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<BoltResult[]> {
    return this.prisma.boltResult.findMany();
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
