import { Injectable } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOpticboltTestResultInput } from './dto/create-opticbolt.input';
import { UpdateOpticboltTestResultInput } from './dto/update-opticbolt.input';
import { OpticboltTestResult } from '@prisma/client';

@Injectable()
export class OpticboltService {
  constructor(private readonly prisma: PrismaService) {}

  private mapDecimals(result: OpticboltTestResult | null) {
    if (!result) return null;
    return {
      ...result,
      amplitude20: result.amplitude20 ? Number(result.amplitude20) : null,
      wavelength20: result.wavelength20 ? Number(result.wavelength20) : null,
      amplitude100: result.amplitude100 ? Number(result.amplitude100) : null,
      wavelength100: result.wavelength100 ? Number(result.wavelength100) : null,
      peakInitialNm: result.peakInitialNm ? Number(result.peakInitialNm) : null,
      peak20Nm: result.peak20Nm ? Number(result.peak20Nm) : null,
      peak100Nm: result.peak100Nm ? Number(result.peak100Nm) : null,
      strain20: result.strain20 ? Number(result.strain20) : null,
      strain100: result.strain100 ? Number(result.strain100) : null,
      load20: result.load20 ? Number(result.load20) : null,
      load100: result.load100 ? Number(result.load100) : null,
      calibrationFactor: result.calibrationFactor ? Number(result.calibrationFactor) : null,
    };
  }

  async findAll() {
    const results = await this.prisma.opticboltTestResult.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return results.map((r) => this.mapDecimals(r));
  }

  async findOne(id: string) {
    const result = await this.prisma.opticboltTestResult.findUnique({
      where: { id },
    });
    if (!result) {
      throw new UserInputError(`OpticboltTestResult #${id} does not exist`);
    }
    return this.mapDecimals(result);
  }

  async create(input: CreateOpticboltTestResultInput) {
    const result = await this.prisma.opticboltTestResult.create({
      data: {
        serialNumber: input.serialNumber,
        drawingNumber: input.drawingNumber,
        boltType: input.boltType,
        description: input.description,
        testedAt: input.testedAt,
        testedBy: input.testedBy,
        result: input.result,
        fibreCheck1: input.fibreCheck1 ?? false,
        fibreCheck2: input.fibreCheck2 ?? false,
        psi20: input.psi20,
        psi100: input.psi100,
        spectrumIndex: input.spectrumIndex,
        amplitude20: input.amplitude20,
        wavelength20: input.wavelength20,
        amplitude100: input.amplitude100,
        wavelength100: input.wavelength100,
        peakInitialNm: input.peakInitialNm,
        peak20Nm: input.peak20Nm,
        peak100Nm: input.peak100Nm,
        strain20: input.strain20,
        strain100: input.strain100,
        load20: input.load20,
        load100: input.load100,
        time20Ms: input.time20Ms,
        time100Ms: input.time100Ms,
        calibrationFactor: input.calibrationFactor,
      },
    });
    return this.mapDecimals(result);
  }

  async update(id: string, input: UpdateOpticboltTestResultInput) {
    const existing = await this.prisma.opticboltTestResult.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new UserInputError(`OpticboltTestResult #${id} does not exist`);
    }

    const updated = await this.prisma.opticboltTestResult.update({
      where: { id },
      data: {
        serialNumber: input.serialNumber !== undefined ? input.serialNumber : undefined,
        drawingNumber: input.drawingNumber !== undefined ? input.drawingNumber : undefined,
        boltType: input.boltType !== undefined ? input.boltType : undefined,
        description: input.description !== undefined ? input.description : undefined,
        testedAt: input.testedAt !== undefined ? input.testedAt : undefined,
        testedBy: input.testedBy !== undefined ? input.testedBy : undefined,
        result: input.result !== undefined ? input.result : undefined,
        fibreCheck1: input.fibreCheck1 !== undefined ? input.fibreCheck1 : undefined,
        fibreCheck2: input.fibreCheck2 !== undefined ? input.fibreCheck2 : undefined,
        psi20: input.psi20 !== undefined ? input.psi20 : undefined,
        psi100: input.psi100 !== undefined ? input.psi100 : undefined,
        spectrumIndex: input.spectrumIndex !== undefined ? input.spectrumIndex : undefined,
        amplitude20: input.amplitude20 !== undefined ? input.amplitude20 : undefined,
        wavelength20: input.wavelength20 !== undefined ? input.wavelength20 : undefined,
        amplitude100: input.amplitude100 !== undefined ? input.amplitude100 : undefined,
        wavelength100: input.wavelength100 !== undefined ? input.wavelength100 : undefined,
        peakInitialNm: input.peakInitialNm !== undefined ? input.peakInitialNm : undefined,
        peak20Nm: input.peak20Nm !== undefined ? input.peak20Nm : undefined,
        peak100Nm: input.peak100Nm !== undefined ? input.peak100Nm : undefined,
        strain20: input.strain20 !== undefined ? input.strain20 : undefined,
        strain100: input.strain100 !== undefined ? input.strain100 : undefined,
        load20: input.load20 !== undefined ? input.load20 : undefined,
        load100: input.load100 !== undefined ? input.load100 : undefined,
        time20Ms: input.time20Ms !== undefined ? input.time20Ms : undefined,
        time100Ms: input.time100Ms !== undefined ? input.time100Ms : undefined,
        calibrationFactor: input.calibrationFactor !== undefined ? input.calibrationFactor : undefined,
      },
    });
    return this.mapDecimals(updated);
  }

  async remove(id: string) {
    const existing = await this.prisma.opticboltTestResult.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new UserInputError(`OpticboltTestResult #${id} does not exist`);
    }

    const removed = await this.prisma.opticboltTestResult.delete({
      where: { id },
    });
    return this.mapDecimals(removed);
  }
}
