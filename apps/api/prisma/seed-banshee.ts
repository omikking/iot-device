import 'tsconfig-paths/register';

import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { BansheeRequestsService } from 'src/banshee-request/banshee-request.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BansheeRequestModule } from 'src/banshee-request/banshee-request.module';
import { BansheeStatsModule } from 'src/banshee-stats/banshee-stats.module';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import {
  BoltType,
  GlobalRole,
  PrismaClient,
  RingPosition,
} from '@prisma/client';

@Module({
  imports: [PrismaModule, BansheeStatsModule, BansheeRequestModule],
})
export class SeedBansheeModule {}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedBanshee() {
  const prisma = new PrismaClient();

  const app = await NestFactory.createApplicationContext(SeedBansheeModule);
  const bansheeService = app.get(BansheeRequestsService);

  const systemUser: ActiveUserData = {
    id: '3e072d06-6cc6-4b43-bd0e-acdd1bd6f890',
    email: 'gianni.toy75@gmail.com',
    fullName: 'Gianni Toy',
    globalRole: GlobalRole.SANDVIK_ADMIN,
    userPermissions: [],
  };

  const locations = await prisma.location.findMany({
    include: {
      drive: {
        include: {
          level: {
            include: {
              site: {
                include: {
                  company: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!locations.length) {
    throw new Error(
      'No valid Company → Site → Level → Drive → Location hierarchy found',
    );
  }

  // Seed BoltTypeConstant with default values for D47_MD_1_8_M
  const existingBoltConstant = await prisma.bansheeBoltTypeConstant.findFirst({
    where: { boltType: BoltType.D47_MD_1_8_M },
  });

  if (!existingBoltConstant) {
    await prisma.bansheeBoltTypeConstant.create({
      data: {
        boltType: BoltType.D47_MD_1_8_M,
        velocity: 5890,
        tempCorrectionFactor: 1.0027,
        tempCoeff: 106,
        quadCoeff1: 0.010355,
        linCoeff1: 0.192547,
        quadCoeff2: 0.000487,
        linCoeff2: 0.770804,
        constTerm: 5.190402,
        nominalLength: 2300,
        linearLimit: 50,
        elasticLimit: 10,
        lowPlasticLimit: 100,
        createdAt: new Date(),
      },
    });
    console.log('Seeded BoltTypeConstant for D47_MD_1_8_M with default values');
  } else {
    console.log('BoltTypeConstant for D47_MD_1_8_M already exists, skipping');
  }

  // Fetch distinct fileNames from proceqData and merge with hardcoded serial numbers
  const proceqFileNames = await prisma.proceqData.findMany({
    select: { fileName: true },
    distinct: ['fileName'],
  });

  // proceq-sync appends `_<13-digit ms timestamp>` to fileName before storing.
  // Strip it so the BansheeRequest.serialNumber matches the un-suffixed key the sync uses for linking.
  const TIMESTAMP_SUFFIX = /_\d{13}$/;
  const stripTimestampSuffix = (fileName: string) =>
    fileName.replace(TIMESTAMP_SUFFIX, '');
  const proceqSerialNumbers = [
    ...new Set(proceqFileNames.map((p) => stripTimestampSuffix(p.fileName))),
  ];
  // const existingSet = new Set(serialNumbers);
  // const newFromProceq = proceqSerialNumbers.filter(
  //   (fn) => !existingSet.has(fn),
  // );
  const allSerialNumbers = [...proceqSerialNumbers];
  console.log(
    `Serial numbers: hardcoded + from proceqData = ${allSerialNumbers.length} total`,
  );

  const ringPositions = Object.values(RingPosition);

  const baseInput = {
    name: 'Seeded Banshee Request',
    period: 1,
    locationDetails: 'Near the main entrance',
    boltInstallationDateTime: '2025-12-11T10:00:00Z',
    ringPosition: pickRandom(ringPositions),
    coordinates: {
      x: parseFloat((Math.random() * 100).toFixed(2)),
      y: parseFloat((Math.random() * 100).toFixed(2)),
      z: parseFloat((Math.random() * 50).toFixed(2)),
    },
    comment: 'Seeded via internal script',
    isBrokenBolt: false,
    isNotMeasurable: false,
    boltType: 'D47_MD_1_8_M',
  };

  // await prisma.bansheeRequest.deleteMany({
  //   where: {
  //     serialNumber: {
  //       in: serialNumbers,
  //     },
  //   },
  // });
  // await prisma.$transaction([
  //   prisma.proceqAttachment.deleteMany(),
  //   prisma.proceqData.deleteMany(),
  // ]);

  for (const serialNumber of allSerialNumbers) {
    try {
      const location = pickRandom(locations);

      const levelId = location.drive.level.id;
      const driveId = location.drive.id;
      const locationId = location.id;
      const siteId = location.drive.level.site.id;
      const companyId = location.drive.level.site.company.id;

      const createdRequest = await bansheeService.create(
        {
          ...baseInput,
          serialNumber,
          levelId,
          driveId,
          locationId,
          siteId,
          companyId,
        } as any,
        systemUser,
      );
      console.log(createdRequest);
    } catch (err: any) {
      console.error(
        `Failed → ${serialNumber}`,
        err?.extensions?.code || err?.message,
      );
    }
  }

  await app.close();
}

seedBanshee()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
