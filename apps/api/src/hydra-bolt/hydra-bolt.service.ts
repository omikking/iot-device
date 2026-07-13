import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHydraboltInput } from './dto/create-hydrabolt.input';

@Injectable()
export class HydraBoltService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateHydraboltInput) {
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
