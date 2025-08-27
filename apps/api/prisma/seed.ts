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
import { faker } from '@faker-js/faker';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // Clear existing data
  await cleanup();

  // Generate admin users
  const adminUsers = await generateAdminUsers(3);
  console.log(`✅ Created ${adminUsers.length} admin users`);

  // Generate technician users
  const technicianUsers = await generateTechnicianUsers(10);
  console.log(`✅ Created ${technicianUsers.length} technician users`);

  // Generate companies with plans
  const companies = await generateCompanies(5, adminUsers);
  console.log(`✅ Created ${companies.length} companies`);

  // Generate sites for each company
  const sites = await generateSites(companies);
  console.log(`✅ Created ${sites.length} sites`);

  // Generate levels for each site
  const levels = await generateLevels(sites);
  console.log(`✅ Created ${levels.length} levels`);

  // Generate drives for each level
  const drives = await generateDrives(levels);
  console.log(`✅ Created ${drives.length} drives`);

  // Generate locations for each drive
  const locations = await generateLocations(drives);
  console.log(`✅ Created ${locations.length} locations`);

  // Generate bolt results for each location (including some hazards)
  const boltResults = await generateBoltResults(locations, technicianUsers);
  console.log(`✅ Created ${boltResults.length} bolt results`);

  console.log('✅ Seeding complete!');
}

async function cleanup() {
  console.log('🧹 Cleaning up existing data...');

  // Delete data in reverse order of dependencies
  await prisma.boltResult.deleteMany();
  await prisma.location.deleteMany();
  await prisma.drive.deleteMany();
  await prisma.level.deleteMany();
  await prisma.site.deleteMany();
  await prisma.userPermission.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.company.deleteMany();
  // Don't delete users as they might be created externally
}

async function generateAdminUsers(count: number) {
  const users = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        hash: await argon.hash('Password123!'),
        fullName: `${firstName} ${lastName}`,
        workPlace: faker.company.name(),
        phoneNumber: faker.phone.number(),
        globalRole: GlobalRole.SANDVIK_ADMIN,
        isGlobalVisibility: true,
      },
    });

    users.push(user);
  }

  return users;
}

async function generateTechnicianUsers(count: number) {
  const users = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        hash: await argon.hash('Password123!'),
        fullName: `${firstName} ${lastName}`,
        workPlace: faker.company.name(),
        phoneNumber: faker.phone.number(),
        globalRole: GlobalRole.SANDVIK_TECHNICIAN,
        isGlobalVisibility: false,
      },
    });

    users.push(user);
  }

  return users;
}

async function generateCompanies(count: number, adminUsers: any[]) {
  const companies = [];
  const applications = [
    Application.PULL_TEST,
    Application.PULL_TEST_OPERATOR,
    Application.BANSHEE,
  ];
  // TODO: Add inactive?
  const planLevels = [PlanLevel.GOLD, PlanLevel.SILVER, PlanLevel.BRONZE];

  for (let i = 0; i < count; i++) {
    const company = await prisma.company.create({
      data: {
        name: faker.company.name(),
        orgNumber: faker.string.numeric(10),
        address: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        city: faker.location.city(),
        country: faker.location.country(),
        companyContactEmail: faker.internet.email().toLowerCase(),
      },
    });

    // Create plans for company
    for (const app of applications) {
      await prisma.plan.create({
        data: {
          companyId: company.id,
          applicationName: app,
          planLevel: faker.helpers.arrayElement(planLevels),
          expiringDate: faker.date.future(),
        },
      });
    }

    // Assign admin users permissions
    const adminUser = adminUsers[i % adminUsers.length];
    await prisma.userPermission.create({
      data: {
        userId: adminUser.id,
        companyId: company.id,
        role: Role.COMPANY_ADMIN,
        appsAccess: [Application.PULL_TEST, Application.PULL_TEST_OPERATOR],
      },
    });

    companies.push(company);
  }

  return companies;
}

async function generateSites(companies: any[]) {
  const sites = [];

  for (const company of companies) {
    const siteCount = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < siteCount; i++) {
      const site = await prisma.site.create({
        data: {
          siteName: `${faker.location.city()} Mine ${i + 1}`,
          address: faker.location.streetAddress(),
          postalCode: faker.location.zipCode(),
          city: faker.location.city(),
          country: faker.location.country(),
          companyId: company.id,
        },
      });

      sites.push(site);
    }
  }

  return sites;
}

async function generateLevels(sites: any[]) {
  const levels = [];

  for (const site of sites) {
    const levelCount = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < levelCount; i++) {
      const level = await prisma.level.create({
        data: {
          levelName: `Level ${faker.number.int({ min: 1000, max: 5000 })}`,
          siteId: site.id,
        },
      });

      levels.push(level);
    }
  }

  return levels;
}

async function generateDrives(levels: any[]) {
  const drives = [];

  for (const level of levels) {
    const driveCount = faker.number.int({ min: 2, max: 4 });

    for (let i = 0; i < driveCount; i++) {
      const drive = await prisma.drive.create({
        data: {
          driveName: `Drive ${faker.number.int({ min: 100, max: 999 })}`,
          levelId: level.id,
        },
      });

      drives.push(drive);
    }
  }

  return drives;
}

async function generateLocations(drives: any[]) {
  const locations = [];

  for (const drive of drives) {
    const locationCount = faker.number.int({ min: 3, max: 8 });

    for (let i = 0; i < locationCount; i++) {
      const location = await prisma.location.create({
        data: {
          locationName: `${faker.number.int({ min: 10, max: 50 })}, ${faker.number.int({ min: 20, max: 99 })}`,
          driveId: drive.id,
        },
      });

      locations.push(location);
    }
  }

  return locations;
}

async function generateBoltResults(locations: any[], technicianUsers: any[]) {
  const boltResults = [];
  const boltTypes = Object.values(BoltType);
  const ringPositions = Object.values(RingPosition);
  const resultTypes = Object.values(Result);
  const abortReasons = Object.values(PullTestAbortReason);

  for (const location of locations) {
    // Get parent relationships for this location
    const drive = await prisma.drive.findUnique({
      where: { id: location.driveId },
      include: { level: true },
    });

    if (!drive || !drive.level) continue;

    const level = drive.level;
    const site = await prisma.site.findUnique({ where: { id: level.siteId } });
    if (!site) continue;

    const boltCount = faker.number.int({ min: 5, max: 15 });

    for (let i = 0; i < boltCount; i++) {
      const isHazard = faker.datatype.boolean(0.2); // 20% chance of hazard
      const result = isHazard
        ? Result.FAIL
        : faker.helpers.arrayElement(resultTypes);

      const technician = faker.helpers.arrayElement(technicianUsers);
      const peakLoadValues = [faker.number.int({ min: 5, max: 30 })];

      // Sometimes add multiple readings for the same bolt (multi-read)
      if (faker.datatype.boolean(0.3)) {
        peakLoadValues.push(faker.number.int({ min: 5, max: 30 }));
        if (faker.datatype.boolean(0.2)) {
          peakLoadValues.push(faker.number.int({ min: 5, max: 30 }));
        }
      }

      const boltResult = await prisma.boltResult.create({
        data: {
          boltNumber: faker.number.int({ min: 100, max: 999 }),
          boltType: faker.helpers.arrayElement(boltTypes),
          peakLoad: peakLoadValues,
          peakDisplacement: peakLoadValues.map(() =>
            faker.number.int({ min: 1, max: 50 }),
          ),
          positionInRing: faker.helpers.arrayElement(ringPositions),
          result: result,
          isHazard: isHazard,
          hazardCompletedDate:
            isHazard && faker.datatype.boolean(0.5)
              ? [faker.date.recent()]
              : [],
          abortReason:
            result === Result.ABORT
              ? faker.helpers.arrayElement(abortReasons)
              : null,
          comment: faker.datatype.boolean(0.6) ? faker.lorem.sentence() : null,
          image: faker.datatype.boolean(0.3) ? faker.image.url() : null,
          createdAt: faker.date.recent({ days: 30 }),
          updatedAt: faker.date.recent({ days: 30 }),
          siteId: site.id,
          levelId: level.id,
          driveId: drive.id,
          locationId: location.id,
          userId: technician.id,
        },
      });

      boltResults.push(boltResult);
    }
  }

  return boltResults;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
