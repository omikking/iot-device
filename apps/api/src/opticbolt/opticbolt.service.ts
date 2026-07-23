import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OpticboltTestResult, OpticboltSpectrum } from '@prisma/client';

@Injectable()
export class OpticboltService {
  constructor(private readonly prisma: PrismaService) {}

  private mapSpectrumDecimals(spec: OpticboltSpectrum | null) {
    if (!spec) return null;
    return {
      ...spec,
      amplitude20: spec.amplitude20 ? Number(spec.amplitude20) : null,
      wavelength20: spec.wavelength20 ? Number(spec.wavelength20) : null,
      amplitude100: spec.amplitude100 ? Number(spec.amplitude100) : null,
      wavelength100: spec.wavelength100 ? Number(spec.wavelength100) : null,
      peakInitialNm: spec.peakInitialNm ? Number(spec.peakInitialNm) : null,
      peak20Nm: spec.peak20Nm ? Number(spec.peak20Nm) : null,
      peak100Nm: spec.peak100Nm ? Number(spec.peak100Nm) : null,
      strain20: spec.strain20 ? Number(spec.strain20) : null,
      strain100: spec.strain100 ? Number(spec.strain100) : null,
      load20: spec.load20 ? Number(spec.load20) : null,
      load100: spec.load100 ? Number(spec.load100) : null,
      calibrationFactor: spec.calibrationFactor
        ? Number(spec.calibrationFactor)
        : null,
    };
  }

  private mapTestResultDecimals(
    result: (OpticboltTestResult & { spectrums?: OpticboltSpectrum[] }) | null,
  ) {
    if (!result) return null;
    return {
      ...result,
      spectrums: result.spectrums
        ? result.spectrums.map((s) => this.mapSpectrumDecimals(s))
        : [],
    };
  }

  async findAll(since?: Date) {
    const results = await this.prisma.opticboltTestResult.findMany({
      where: since
        ? {
            updatedAt: {
              gte: new Date(since.getTime() + 1),
            },
          }
        : undefined,
      include: { spectrums: true },
      orderBy: { createdAt: 'desc' },
    });
    return results.map((r) => this.mapTestResultDecimals(r));
  }

  async findSpectrumsBySerialNumber(serialNumber: string) {
    const spectrums = await this.prisma.opticboltSpectrum.findMany({
      where: {
        testResult: {
          serialNumber,
        },
      },
      orderBy: { fbgIndex: 'asc' },
    });
    return spectrums.map((s) => this.mapSpectrumDecimals(s));
  }

  async createWithSpectrums(input: any) {
    const existing = await this.prisma.opticboltTestResult.findUnique({
      where: { serialNumber: input.serialNumber },
    });
    if (existing) {
      throw new ConflictException(
        `An optic bolt test result with serial number "${input.serialNumber}" already exists.`,
      );
    }

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
        fibreCheck3: input.fibreCheck3 ?? false,
        psi20: input.psi20,
        psi100: input.psi100,
        spectrums: {
          create: input.spectrums,
        },
      },
      include: {
        spectrums: true,
      },
    });
    return this.mapTestResultDecimals(result);
  }

  async updateWithSpectrums(serialNumber: string, input: any) {
    const existing = await this.prisma.opticboltTestResult.findUnique({
      where: { serialNumber },
    });
    if (!existing) {
      throw new NotFoundException(
        `Optic bolt test result with serial number "${serialNumber}" not found.`,
      );
    }

    if (input.serialNumber && input.serialNumber !== existing.serialNumber) {
      const conflict = await this.prisma.opticboltTestResult.findUnique({
        where: { serialNumber: input.serialNumber },
      });
      if (conflict) {
        throw new ConflictException(
          `An optic bolt test result with serial number "${input.serialNumber}" already exists.`,
        );
      }
    }

    const { spectrums, ...rest } = input;

    const result = await this.prisma.$transaction(async (tx) => {
      if (spectrums) {
        // Delete all old spectrums
        await tx.opticboltSpectrum.deleteMany({
          where: { testResultId: existing.id },
        });
      }

      return tx.opticboltTestResult.update({
        where: { serialNumber },
        data: {
          ...rest,
          spectrums: spectrums
            ? {
                create: spectrums,
              }
            : undefined,
        },
        include: {
          spectrums: true,
        },
      });
    });

    return this.mapTestResultDecimals(result);
  }

  async updateSpectrumBySerialAndFbg(
    serialNumber: string,
    fbgIndex: number,
    input: any,
  ) {
    const testResult = await this.prisma.opticboltTestResult.findUnique({
      where: { serialNumber },
    });
    if (!testResult) {
      throw new NotFoundException(
        `Optic bolt test result with serial number "${serialNumber}" not found.`,
      );
    }

    const existingSpectrum = await this.prisma.opticboltSpectrum.findUnique({
      where: {
        testResultId_fbgIndex: {
          testResultId: testResult.id,
          fbgIndex,
        },
      },
    });
    if (!existingSpectrum) {
      throw new NotFoundException(
        `Spectrum with FBG index ${fbgIndex} under serial number "${serialNumber}" not found.`,
      );
    }

    const { fbgIndex: _, ...dataToUpdate } = input;

    const updatedSpectrum = await this.prisma.opticboltSpectrum.update({
      where: {
        testResultId_fbgIndex: {
          testResultId: testResult.id,
          fbgIndex,
        },
      },
      data: dataToUpdate,
    });

    return this.mapSpectrumDecimals(updatedSpectrum);
  }
}
