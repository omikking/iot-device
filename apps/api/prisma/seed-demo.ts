/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PrismaClient,
  GlobalRole,
  Role,
  Application,
  PlanLevel,
  Result,
  BoltType,
  RingPosition,
  PullTestAbortReason,
} from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function cleanup() {
  console.log('🧹 Cleaning up existing data...');

  await prisma.$transaction([
    prisma.boltResult.deleteMany(),
    prisma.location.deleteMany(),
    prisma.drive.deleteMany(),
    prisma.level.deleteMany(),
    prisma.site.deleteMany(),
    prisma.userPermission.deleteMany(),
    prisma.refreshTokenId.deleteMany(),
    prisma.plan.deleteMany(),
    prisma.company.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('✅ Database cleaned');
}

async function main() {
  console.log('🌱 Starting demo seeding...');

  await cleanup();

  const passwordHash = await argon.hash('Password123!');

  // ============ CREATE USERS ============

  // Sandvik Global Admins
  const osvaldo = await prisma.user.create({
    data: {
      email: 'osvaldo.vallati@sandvik.com',
      hash: passwordHash,
      fullName: 'Osvaldo Vallati',
      workPlace: 'Sandvik',
      phoneNumber: '+46123456789',
      globalRole: GlobalRole.SANDVIK_ADMIN,
      isGlobalVisibility: true,
    },
  });

  const felix = await prisma.user.create({
    data: {
      email: 'felix.ostergren@sandvik.com',
      hash: passwordHash,
      fullName: 'Felix Östergren',
      workPlace: 'Sandvik',
      phoneNumber: '+46987654321',
      globalRole: GlobalRole.SANDVIK_ADMIN,
      isGlobalVisibility: true,
    },
  });

  // ============ CREATE MINE COMPANY 1 ============

  const mineCompany1 = await prisma.company.create({
    data: {
      name: 'Mine Company 1',
      orgNumber: '1111111111',
      address: '123 Mining Road',
      postalCode: '12345',
      city: 'Stockholm',
      country: 'Sweden',
      companyContactEmail: 'contact@minecompany1.com',
    },
  });

  // Create plans for Mine Company 1
  await prisma.plan.create({
    data: {
      companyId: mineCompany1.id,
      applicationName: Application.PULL_TEST,
      planLevel: PlanLevel.GOLD,
      expiringDate: new Date('2026-12-31'),
    },
  });

  await prisma.plan.create({
    data: {
      companyId: mineCompany1.id,
      applicationName: Application.PULL_TEST_TECHNICIAN,
      planLevel: PlanLevel.GOLD,
      expiringDate: new Date('2026-12-31'),
    },
  });

  // Assign Felix as administrator for Mine Company 1
  await prisma.userPermission.create({
    data: {
      userId: felix.id,
      companyId: mineCompany1.id,
      role: Role.SANDVIK_ADMIN,
      appsAccess: [Application.PULL_TEST, Application.PULL_TEST_TECHNICIAN],
    },
  });

  // Company Admin for Mine Company 1
  const mineCompany1Admin = await prisma.user.create({
    data: {
      email: 'minecompany1admin@mail.com',
      hash: passwordHash,
      fullName: 'Mine Company 1 Admin',
      workPlace: 'Mine Company 1',
      phoneNumber: '+46111222333',
      isGlobalVisibility: false,
    },
  });

  await prisma.userPermission.create({
    data: {
      userId: mineCompany1Admin.id,
      companyId: mineCompany1.id,
      role: Role.COMPANY_ADMIN,
      appsAccess: [Application.PULL_TEST, Application.PULL_TEST_TECHNICIAN],
    },
  });

  // Regular User for Mine Company 1
  const mineCompany1User = await prisma.user.create({
    data: {
      email: 'minecompany1regularuser@mail.com',
      hash: passwordHash,
      fullName: 'Mine Company 1 User',
      workPlace: 'Mine Company 1',
      phoneNumber: '+46444555666',
      isGlobalVisibility: false,
    },
  });

  await prisma.userPermission.create({
    data: {
      userId: mineCompany1User.id,
      companyId: mineCompany1.id,
      role: Role.COMPANY_USER,
      appsAccess: [Application.PULL_TEST, Application.PULL_TEST_TECHNICIAN],
    },
  });

  // ============ CREATE MINE COMPANY 2 ============

  const mineCompany2 = await prisma.company.create({
    data: {
      name: 'Mine Company 2',
      orgNumber: '2222222222',
      address: '456 Mining Avenue',
      postalCode: '54321',
      city: 'Gothenburg',
      country: 'Sweden',
      companyContactEmail: 'contact@minecompany2.com',
    },
  });

  // Create plans for Mine Company 2
  await prisma.plan.create({
    data: {
      companyId: mineCompany2.id,
      applicationName: Application.PULL_TEST,
      planLevel: PlanLevel.SILVER,
      expiringDate: new Date('2026-12-31'),
    },
  });

  await prisma.plan.create({
    data: {
      companyId: mineCompany2.id,
      applicationName: Application.PULL_TEST_TECHNICIAN,
      planLevel: PlanLevel.SILVER,
      expiringDate: new Date('2026-12-31'),
    },
  });

  // Assign Felix as administrator for Mine Company 2
  await prisma.userPermission.create({
    data: {
      userId: felix.id,
      companyId: mineCompany2.id,
      role: Role.SANDVIK_ADMIN,
      appsAccess: [Application.PULL_TEST, Application.PULL_TEST_TECHNICIAN],
    },
  });

  // Company Admin for Mine Company 2
  const mineCompany2Admin = await prisma.user.create({
    data: {
      email: 'minecompany2admin@mail.com',
      hash: passwordHash,
      fullName: 'Mine Company 2 Admin',
      workPlace: 'Mine Company 2',
      phoneNumber: '+46777888999',
      isGlobalVisibility: false,
    },
  });

  await prisma.userPermission.create({
    data: {
      userId: mineCompany2Admin.id,
      companyId: mineCompany2.id,
      role: Role.COMPANY_ADMIN,
      appsAccess: [Application.PULL_TEST, Application.PULL_TEST_TECHNICIAN],
    },
  });

  // Regular User for Mine Company 2
  const mineCompany2User = await prisma.user.create({
    data: {
      email: 'minecompany2regularuser@mail.com',
      hash: passwordHash,
      fullName: 'Mine Company 2 User',
      workPlace: 'Mine Company 2',
      phoneNumber: '+46222333444',
      isGlobalVisibility: false,
    },
  });

  await prisma.userPermission.create({
    data: {
      userId: mineCompany2User.id,
      companyId: mineCompany2.id,
      role: Role.COMPANY_USER,
      appsAccess: [Application.PULL_TEST, Application.PULL_TEST_TECHNICIAN],
    },
  });

  // ============ CREATE SITE STRUCTURE FOR MINE COMPANY 1 ============

  // Site A
  const siteA = await prisma.site.create({
    data: {
      siteName: 'Site A',
      address: '789 Mine Site Road',
      postalCode: '11111',
      city: 'Kiruna',
      country: 'Sweden',
      companyId: mineCompany1.id,
    },
  });

  // Level 1
  const level1 = await prisma.level.create({
    data: {
      levelName: 'Level 1',
      siteId: siteA.id,
    },
  });

  // Drive A
  const driveA = await prisma.drive.create({
    data: {
      driveName: 'Drive A',
      levelId: level1.id,
    },
  });

  const location1 = await prisma.location.create({
    data: {
      locationName: 'Location 1',
      driveId: driveA.id,
    },
  });

  const location2 = await prisma.location.create({
    data: {
      locationName: 'Location 2',
      driveId: driveA.id,
    },
  });

  // Drive B
  const driveB = await prisma.drive.create({
    data: {
      driveName: 'Drive B',
      levelId: level1.id,
    },
  });

  const location3 = await prisma.location.create({
    data: {
      locationName: 'Location 3',
      driveId: driveB.id,
    },
  });

  const location4 = await prisma.location.create({
    data: {
      locationName: 'Location 4',
      driveId: driveB.id,
    },
  });

  // Level 2
  const level2 = await prisma.level.create({
    data: {
      levelName: 'Level 2',
      siteId: siteA.id,
    },
  });

  // Drive C
  const driveC = await prisma.drive.create({
    data: {
      driveName: 'Drive C',
      levelId: level2.id,
    },
  });

  const location5 = await prisma.location.create({
    data: {
      locationName: 'Location 5',
      driveId: driveC.id,
    },
  });

  const location6 = await prisma.location.create({
    data: {
      locationName: 'Location 6',
      driveId: driveC.id,
    },
  });

  // Level 3
  const level3 = await prisma.level.create({
    data: {
      levelName: 'Level 3',
      siteId: siteA.id,
    },
  });

  // Drive D
  const driveD = await prisma.drive.create({
    data: {
      driveName: 'Drive D',
      levelId: level3.id,
    },
  });

  const location7 = await prisma.location.create({
    data: {
      locationName: 'Location 7',
      driveId: driveD.id,
    },
  });

  const location8 = await prisma.location.create({
    data: {
      locationName: 'Location 8',
      driveId: driveD.id,
    },
  });

  // Site B
  const siteB = await prisma.site.create({
    data: {
      siteName: 'Site B',
      address: '321 Secondary Site Road',
      postalCode: '22222',
      city: 'Malmö',
      country: 'Sweden',
      companyId: mineCompany1.id,
    },
  });

  console.log('✅ Created company structure');

  // ============ CREATE BOLT RESULTS FROM CSV DATA ============

  // Helper function to parse bolt type
  const parseBoltType = (boltTypeStr: string): BoltType => {
    const cleanType = boltTypeStr.trim();

    if (cleanType.includes('D47 MDX') && cleanType.includes('3.0')) {
      return BoltType.D47_MDX_3_0_M;
    }
    if (cleanType.includes('Friction Bolt') && cleanType.includes('47')) {
      return BoltType.FRICTION_BOLT_47_MM;
    }
    if (cleanType.includes('D47 MD') && cleanType.includes('2.4')) {
      return BoltType.D47_MD_2_4_M;
    }

    // Default fallback
    return BoltType.D47_MDX_3_0_M;
  };

  // Helper function to parse position in ring
  const parsePositionInRing = (position: string): RingPosition => {
    const pos = position.trim();

    if (pos.includes('L/H Shoulder')) return RingPosition.LH_SHOULDER;
    if (pos.includes('R/H Shoulder')) return RingPosition.RH_SHOULDER;
    if (pos.includes('R/H Wall Upper')) return RingPosition.RH_WALL_UPPER;
    if (pos.includes('R/H Backs')) return RingPosition.RH_BACKS;
    if (pos.includes('L/H Wall Lower')) return RingPosition.LH_WALL_LOWER;

    return RingPosition.LH_SHOULDER; // Default
  };

  // Helper function to parse result
  const parseResult = (result: string): Result => {
    const res = result.trim().toLowerCase();
    if (res === 'pass') return Result.PASS;
    if (res === 'fail') return Result.FAIL;
    if (res === 'abort') return Result.ABORT;
    return Result.PASS;
  };

  // Helper function to parse abort reason
  const parseAbortReason = (
    reason: string,
  ): PullTestAbortReason | undefined => {
    if (!reason || reason.trim() === '') return undefined;

    const r = reason.trim();
    if (r === 'NOT_TESTED_VOID_CAVITY')
      return PullTestAbortReason.NOT_TESTED_VOID_CAVITY;

    return undefined;
  };

  // Helper to parse arrays from CSV
  const parseArray = (str: string): number[] => {
    return str
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
  };

  // Helper to parse date
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  // Bolt results from CSV (manually mapped based on the CSV data)
  const boltResultsData = [
    // Location_1 (Level_1, Drive_A)
    {
      boltNumber: 1,
      boltType: BoltType.D47_MDX_3_0_M,
      peakLoad: [15],
      peakDisplacement: [62],
      positionInRing: RingPosition.LH_SHOULDER,
      result: Result.PASS,
      comment: '15t target achieved',
      locationId: location1.id,
      levelId: level1.id,
      driveId: driveA.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2025-10-13'),
    },
    {
      boltNumber: 2,
      boltType: BoltType.D47_MDX_3_0_M,
      peakLoad: [15],
      peakDisplacement: [25],
      positionInRing: RingPosition.RH_SHOULDER,
      result: Result.PASS,
      comment: '15t target achieved',
      locationId: location1.id,
      levelId: level1.id,
      driveId: driveA.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2025-10-13'),
    },
    // Location_2 (Level_1, Drive_A)
    {
      boltNumber: 3,
      boltType: BoltType.D47_MDX_3_0_M,
      peakLoad: [17],
      peakDisplacement: [23],
      positionInRing: RingPosition.RH_SHOULDER,
      result: Result.PASS,
      comment: '15t target achieved',
      locationId: location2.id,
      levelId: level1.id,
      driveId: driveA.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2025-10-13'),
    },
    // Location_3 (Level_1, Drive_B)
    {
      boltNumber: 1,
      boltType: BoltType.D47_MDX_3_0_M,
      peakLoad: [15],
      peakDisplacement: [45],
      positionInRing: RingPosition.LH_SHOULDER,
      result: Result.PASS,
      comment: '15t target achieved',
      locationId: location3.id,
      levelId: level1.id,
      driveId: driveB.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2025-10-13'),
    },
    {
      boltNumber: 2,
      boltType: BoltType.D47_MDX_3_0_M,
      peakLoad: [15],
      peakDisplacement: [44],
      positionInRing: RingPosition.RH_WALL_UPPER,
      result: Result.PASS,
      comment: '15t target achieved',
      locationId: location3.id,
      levelId: level1.id,
      driveId: driveB.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2025-10-13'),
    },
    // Location_5 (Level_2, Drive_C)
    {
      boltNumber: 1,
      boltType: BoltType.D47_MDX_3_0_M,
      peakLoad: [16],
      peakDisplacement: [35],
      positionInRing: RingPosition.RH_BACKS,
      result: Result.PASS,
      comment: '15t target achieved',
      locationId: location5.id,
      levelId: level2.id,
      driveId: driveC.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2025-10-13'),
    },
    // Location_6 (Level_2, Drive_C) - Abort cases
    {
      boltNumber: 1,
      boltType: BoltType.FRICTION_BOLT_47_MM,
      peakLoad: [8],
      peakDisplacement: [60],
      positionInRing: RingPosition.RH_WALL_UPPER,
      result: Result.ABORT,
      abortReason: PullTestAbortReason.NOT_TESTED_VOID_CAVITY,
      comment:
        '10t target not achieved, Test not carried out because large cavity behind rock plate',
      locationId: location6.id,
      levelId: level2.id,
      driveId: driveC.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2025-10-13'),
    },
    {
      boltNumber: 2,
      boltType: BoltType.FRICTION_BOLT_47_MM,
      peakLoad: [8],
      peakDisplacement: [60],
      positionInRing: RingPosition.RH_SHOULDER,
      result: Result.ABORT,
      abortReason: PullTestAbortReason.NOT_TESTED_VOID_CAVITY,
      comment:
        '10t target not achieved, Test not carried out because large cavity behind rock plate',
      locationId: location6.id,
      levelId: level2.id,
      driveId: driveC.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2025-10-13'),
    },
    // Location_7 (Level_3, Drive_D) - Multiple tests from 4/02/2021
    {
      boltNumber: 1,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 7, 14, 20, 24],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 2,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 1, 6, 11, 18],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 3,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 3, 7, 9, 11],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 4,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 19, 24, 33, 39],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 5,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15],
      peakDisplacement: [0, 3, 5],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.FAIL,
      comment:
        'Anchor in Sandstone with oversized hole, Test stopped due to bolt sliding',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 6,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 6, 14, 24, 38],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 7,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 5, 10, 13, 18],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 8,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 3, 8, 10, 13],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 9,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 2, 3, 6, 11],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 10,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15],
      peakDisplacement: [0, 4, 6, 9],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.FAIL,
      comment:
        'Anchor in Sandstone with oversized hole, Test stopped due to bolt sliding',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 11,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 4, 10, 13, 19],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    // Additional tests from 26/05/2021 - Sandstone with oversized hole
    {
      boltNumber: 1,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 5, 13, 17, 21],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-05-26'),
    },
    {
      boltNumber: 2,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 3, 7, 11, 14],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-05-26'),
    },
    {
      boltNumber: 3,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 3, 9, 11, 15],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-05-26'),
    },
    {
      boltNumber: 4,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 4, 7, 10, 15],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-05-26'),
    },
    // Tests in Sandstone (4/02/2021)
    {
      boltNumber: 1,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 3, 7, 9, 11],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 2,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 4, 7, 8, 12],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Sandstone',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    // Tests in Shale with oversized hole (4/02/2021)
    {
      boltNumber: 1,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 2, 4, 7, 8],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 2,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 2, 9, 14, 21],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 3,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 6, 11, 16, 19],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 4,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 5, 9, 11, 16],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 5,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 7, 20, 23, 28],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 6,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 2, 4, 8, 11],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 7,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 4, 7, 10, 17],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 8,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 21, 29, 36, 41],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 9,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 5, 11, 15, 19],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 10,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 2, 4, 7, 12],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    // Tests in Shale with oversized hole (26/05/2021)
    {
      boltNumber: 1,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 4, 9, 12, 16],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-05-26'),
    },
    {
      boltNumber: 2,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 3, 6, 8, 12],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-05-26'),
    },
    {
      boltNumber: 3,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 3, 6, 8, 10],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-05-26'),
    },
    {
      boltNumber: 4,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 9, 26, 32, 37],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale with oversized hole',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-05-26'),
    },
    // Tests in Shale (4/02/2021)
    {
      boltNumber: 1,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 8, 14, 18, 22],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
    {
      boltNumber: 2,
      boltType: BoltType.D47_MD_2_4_M,
      peakLoad: [0, 5, 10, 15, 20],
      peakDisplacement: [0, 2, 8, 11, 13],
      positionInRing: RingPosition.LH_WALL_LOWER,
      result: Result.PASS,
      comment: 'Anchor in Shale',
      locationId: location7.id,
      levelId: level3.id,
      driveId: driveD.id,
      siteId: siteA.id,
      userId: felix.id,
      createdAt: new Date('2021-02-04'),
    },
  ];

  // Create all bolt results
  for (const boltData of boltResultsData) {
    const isHazard =
      boltData.result === Result.FAIL || boltData.result === Result.ABORT;

    await prisma.boltResult.create({
      data: {
        ...boltData,
        isHazard,
        hazardCompletedDate: [],
      },
    });
  }

  console.log(`✅ Created ${boltResultsData.length} bolt results`);

  console.log('\n✅ Demo seeding complete!');
  printLoginInstructions();
}

function printLoginInstructions() {
  console.log('\n🔑 DEMO ACCOUNTS');
  console.log('=====================================');
  console.log('All passwords: Password123!');
  console.log('-------------------------------------');
  console.log('osvaldo.vallati@sandvik.com    - Sandvik Admin');
  console.log('felix.ostergren@sandvik.com    - Sandvik Admin');
  console.log('-------------------------------------');
  console.log('minecompany1admin@mail.com     - Mine Company 1 Admin');
  console.log('minecompany1regularuser@mail.com - Mine Company 1 User');
  console.log('-------------------------------------');
  console.log('minecompany2admin@mail.com     - Mine Company 2 Admin');
  console.log('minecompany2regularuser@mail.com - Mine Company 2 User');
  console.log('=====================================\n');
}

main()
  .catch((e) => {
    console.error('Error during demo seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
