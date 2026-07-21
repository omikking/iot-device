import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHydraboltInput } from './dto/create-hydrabolt.input';

@Injectable()
export class HydraBoltService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(since?: Date) {
    return this.prisma.hydrabolt.findMany({
      where: since
        ? {
            updatedAt: {
              gt: since,
            },
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPartNumber(partNumber: string) {
    return this.prisma.hydrabolt.findFirst({
      where: { partNumber },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(input: CreateHydraboltInput) {
    const existing = await this.prisma.hydrabolt.findFirst({
      where: { partNumber: input.partNumber },
    });
    if (existing) {
      throw new ConflictException(
        `A hydra bolt with part number "${input.partNumber}" already exists.`,
      );
    }

    return this.prisma.hydrabolt.create({
      data: {
        partNumber: input.partNumber,
        drawingNumber: input.drawingNumber,
        boltLength: input.boltLength,
        description: input.description,
        numberOfFBG: input.numberOfFBG,
        positionOfFBGs: input.positionOfFBGs,
        initialWavelength: input.initialWavelength,
        elasticLimit: input.elasticLimit,
        lowPlasticLimit: input.lowPlasticLimit,
        highPlasticLimit: input.highPlasticLimit,
        maxCalibrationFactor: input.maxCalibrationFactor,
        minCalibrationFactor: input.minCalibrationFactor,
      },
    });
  }
}
