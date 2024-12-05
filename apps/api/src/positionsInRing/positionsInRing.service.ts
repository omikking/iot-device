import { Injectable } from '@nestjs/common';
import { PositionInRing, RingPosition } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class PositionsInRingService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<PositionInRing[]> {
    return this.prisma.positionInRing.findMany();
  }

  async findOne(id: string): Promise<PositionInRing> {
    const positionInRing = await this.prisma.positionInRing.findUnique({
      where: { id },
    });
    if (!positionInRing) {
      throw new UserInputError(`PositionInRing #${id} not found`);
    }
    return positionInRing;
  }

  async create(
    createPositionInRingInput: GraphQLTypes.CreatePositionInRingInput,
  ): Promise<PositionInRing> {
    const createdPositionInRing = await this.prisma.positionInRing.create({
      data: {
        positionInRingName:
          createPositionInRingInput.positionInRingName as RingPosition,
        locationId: createPositionInRingInput.locationId,
      },
    });

    if (!createdPositionInRing) {
      throw new UserInputError('Failed to create positionInRing');
    }
    return createdPositionInRing;
  }

  async update(
    id: string,
    updatePositionInRingInput: GraphQLTypes.UpdatePositionInRingInput,
  ): Promise<PositionInRing> {
    const updatedPositionInRing = await this.prisma.positionInRing.update({
      where: { id },

      data: {
        positionInRingName:
          (updatePositionInRingInput?.positionInRingName as RingPosition) ||
          undefined,
      },
    });

    if (!updatedPositionInRing) {
      throw new UserInputError(`PositionInRing #${id} not found`);
    }
    return updatedPositionInRing;
  }

  async remove(id: string): Promise<PositionInRing> {
    const positionInRing = await this.prisma.positionInRing.delete({
      where: { id },
    });
    if (!positionInRing) {
      throw new UserInputError(`PositionInRing #${id} not found`);
    }
    return positionInRing;
  }
}
