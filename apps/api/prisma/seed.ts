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

  // Create specific test users and companies for easy testing
  await generateTestUsersAndCompanies();
  console.log('✅ Created test users and companies with specific permissions');

  // Generate admin users
  const adminUsers = await generateAdminUsers(2);
  console.log(`✅ Created ${adminUsers.length} additional admin users`);

  // Generate technician users
  const technicianUsers = await generateTechnicianUsers(5);
  console.log(`✅ Created ${technicianUsers.length} technician users`);

  // Generate regular users (no global role)
  const regularUsers = await generateRegularUsers(10);
  console.log(`✅ Created ${regularUsers.length} regular users`);

  // Generate companies with plans
  const companies = await generateCompanies(5, adminUsers, regularUsers);
  console.log(`✅ Created ${companies.length} additional companies`);

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
  printLoginInstructions();
}

function printLoginInstructions() {
  console.log('\n🔑 TEST ACCOUNTS');
  console.log('=====================================');
  console.log('All passwords: Password123!');
  console.log('-------------------------------------');
  console.log('felix@mail.com          - Sandvik Admin (full access)');
  console.log('superadmin@mail.com     - Sandvik Admin (full access)');
  console.log('technician@mail.com     - Sandvik Technician');
  console.log('companyadmin@mail.com   - Company Admin');
  console.log('regularuser@mail.com    - Regular user (no global role)');
  console.log('pulltesttechnician@mail.com       - Pull Test Technician only');
  console.log('multiadmin@mail.com     - Admin for multiple companies');
  console.log('expired@mail.com        - User with expired plan access');
  console.log('noapp@mail.com          - User with no app access');
  console.log('=====================================');
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
  await prisma.user.deleteMany(); // Clear all users for a fresh start
}

async function generateTestUsersAndCompanies() {
  // Common password for all test users
  const passwordHash = await argon.hash('Password123!');

  // ============ TEST USERS ============

  // 0. Felix
  const felix = await prisma.user.create({
    data: {
      email: 'felix@mail.com',
      hash: passwordHash,
      fullName: 'Felix Gren',
      workPlace: 'Sandvik',
      phoneNumber: '+4613374242',
      globalRole: GlobalRole.SANDVIK_ADMIN,
      isGlobalVisibility: true,
    },
  });

  // 1. Super Admin (Sandvik global admin)
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@mail.com',
      hash: passwordHash,
      fullName: 'Super Admin',
      workPlace: 'Sandvik HQ',
      phoneNumber: '+46123456789',
      globalRole: GlobalRole.SANDVIK_ADMIN,
      isGlobalVisibility: true,
    },
  });

  // 2. Sandvik Technician
  const sandvikTechnician = await prisma.user.create({
    data: {
      email: 'technician@mail.com',
      hash: passwordHash,
      fullName: 'Sandvik Technician',
      workPlace: 'Sandvik Field Office',
      phoneNumber: '+46987654321',
      globalRole: GlobalRole.SANDVIK_TECHNICIAN,
      isGlobalVisibility: true,
    },
  });

  // 3. Company Admin (NO global role - typical customer admin)
  const companyAdmin = await prisma.user.create({
    data: {
      email: 'companyadmin@mail.com',
      hash: passwordHash,
      fullName: 'Company Admin',
      workPlace: 'Mining Corp HQ',
      phoneNumber: '+46111222333',
      isGlobalVisibility: false,
    },
  });

  // 4. Regular User (NO global role - typical end user)
  const regularUser = await prisma.user.create({
    data: {
      email: 'regularuser@mail.com',
      hash: passwordHash,
      fullName: 'Regular User',
      workPlace: 'Mining Corp',
      phoneNumber: '+46444555666',
      isGlobalVisibility: false,
    },
  });

  // 5. Multi-company Admin (NO global role, but admin in multiple companies)
  const multiCompanyAdmin = await prisma.user.create({
    data: {
      email: 'multiadmin@mail.com',
      hash: passwordHash,
      fullName: 'Multi Company Admin',
      workPlace: 'Consulting Group',
      phoneNumber: '+46777888999',
      isGlobalVisibility: false,
    },
  });

  // 6. Pull Test Technician (specialized app user)
  const pullTestTechnician = await prisma.user.create({
    data: {
      email: 'pulltesttechnician@mail.com',
      hash: passwordHash,
      fullName: 'Pull Test Technician',
      workPlace: 'Testing Lab',
      phoneNumber: '+46222333444',
      isGlobalVisibility: false,
    },
  });

  // 7. User with expired plan access
  const expiredUser = await prisma.user.create({
    data: {
      email: 'expired@mail.com',
      hash: passwordHash,
      fullName: 'Expired Plan User',
      workPlace: 'Old Mining Corp',
      phoneNumber: '+46555666777',
      isGlobalVisibility: false,
    },
  });

  // 8. User with no app access
  const noAppUser = await prisma.user.create({
    data: {
      email: 'noapp@mail.com',
      hash: passwordHash,
      fullName: 'No App Access User',
      workPlace: 'Mining Corp',
      phoneNumber: '+46888999000',
      isGlobalVisibility: false,
    },
  });

  // ============ TEST COMPANIES ============

  // 1. Full Access Company (all apps, gold plan)
  const goldMiningCorp = await prisma.company.create({
    data: {
      name: 'Test All Plans Gold Mining Corp',
      orgNumber: '1111111111',
      address: '123 Gold Street',
      postalCode: '12345',
      city: 'Stockholm',
      country: 'Sweden',
      companyContactEmail: 'contact@goldmining.com',
    },
  });

  // Create full plans for Gold Mining Corp
  for (const app of Object.values(Application)) {
    await prisma.plan.create({
      data: {
        companyId: goldMiningCorp.id,
        applicationName: app,
        planLevel: PlanLevel.GOLD,
        expiringDate: faker.date.future({ years: 1 }),
      },
    });
  }

  // 2. Silver Company (only pull test, silver plan)
  const silverMiningCorp = await prisma.company.create({
    data: {
      name: 'Test Pull Test Silver Mining Corp',
      orgNumber: '2222222222',
      address: '456 Silver Street',
      postalCode: '23456',
      city: 'Gothenburg',
      country: 'Sweden',
      companyContactEmail: 'contact@silvermining.com',
    },
  });

  // Create limited plans for Silver Mining Corp
  await prisma.plan.create({
    data: {
      companyId: silverMiningCorp.id,
      applicationName: Application.PULL_TEST,
      planLevel: PlanLevel.SILVER,
      expiringDate: faker.date.future({ years: 1 }),
    },
  });

  await prisma.plan.create({
    data: {
      companyId: silverMiningCorp.id,
      applicationName: Application.PULL_TEST_TECHNICIAN,
      planLevel: PlanLevel.SILVER,
      expiringDate: faker.date.future({ years: 1 }),
    },
  });

  // 3. Expired Plan Company
  const bronzeMiningCorp = await prisma.company.create({
    data: {
      name: 'Test Bronze & Expired Pull Test Mining Corp',
      orgNumber: '3333333333',
      address: '789 Bronze Street',
      postalCode: '34567',
      city: 'Malmö',
      country: 'Sweden',
      companyContactEmail: 'contact@bronzemining.com',
    },
  });

  // Create expired plan for Bronze Mining Corp
  await prisma.plan.create({
    data: {
      companyId: bronzeMiningCorp.id,
      applicationName: Application.PULL_TEST,
      planLevel: PlanLevel.BRONZE,
      expiringDate: faker.date.past({ years: 1 }),
    },
  });

  // Create another valid plan for Bronze Mining Corp
  await prisma.plan.create({
    data: {
      companyId: bronzeMiningCorp.id,
      applicationName: Application.PULL_TEST_OPERATOR,
      planLevel: PlanLevel.BRONZE,
      expiringDate: faker.date.future({ years: 1 }),
    },
  });

  // 4. No Plans Company
  const noPlanCompany = await prisma.company.create({
    data: {
      name: 'Test No Plan Mining',
      orgNumber: '4444444444',
      address: '101 No Plan Road',
      postalCode: '45678',
      city: 'Luleå',
      country: 'Sweden',
      companyContactEmail: 'contact@noplanmining.com',
    },
  });

  // ============ USER PERMISSIONS ============

  // 1. Company Admin for Gold Mining Corp
  await prisma.userPermission.create({
    data: {
      userId: companyAdmin.id,
      companyId: goldMiningCorp.id,
      role: Role.COMPANY_ADMIN,
      appsAccess: [
        Application.PULL_TEST,
        Application.PULL_TEST_TECHNICIAN,
        // Application.BANSHEE,
      ],
    },
  });

  // 2. Regular user for Gold Mining Corp
  await prisma.userPermission.create({
    data: {
      userId: regularUser.id,
      companyId: goldMiningCorp.id,
      role: Role.COMPANY_USER,
      appsAccess: [Application.PULL_TEST, Application.PULL_TEST_TECHNICIAN],
    },
  });

  // 3. Technician for Gold Mining Corp
  await prisma.userPermission.create({
    data: {
      userId: sandvikTechnician.id,
      companyId: goldMiningCorp.id,
      role: Role.SANDVIK_TECHNICIAN,
      appsAccess: [
        Application.PULL_TEST,
        Application.PULL_TEST_TECHNICIAN,
        // Application.BANSHEE,
      ],
    },
  });

  // 4. Multi-company admin (for all companies)
  // For Gold Mining Corp
  await prisma.userPermission.create({
    data: {
      userId: multiCompanyAdmin.id,
      companyId: goldMiningCorp.id,
      role: Role.COMPANY_ADMIN,
      appsAccess: [
        Application.PULL_TEST,
        Application.PULL_TEST_TECHNICIAN,
        // Application.BANSHEE,
      ],
    },
  });

  // For Silver Mining Corp
  await prisma.userPermission.create({
    data: {
      userId: multiCompanyAdmin.id,
      companyId: silverMiningCorp.id,
      role: Role.COMPANY_ADMIN,
      appsAccess: [Application.PULL_TEST, Application.PULL_TEST_TECHNICIAN],
    },
  });

  // For Bronze Mining Corp
  await prisma.userPermission.create({
    data: {
      userId: multiCompanyAdmin.id,
      companyId: bronzeMiningCorp.id,
      role: Role.COMPANY_ADMIN,
      appsAccess: [Application.PULL_TEST, Application.PULL_TEST_OPERATOR],
    },
  });

  // For No Plan Mining
  await prisma.userPermission.create({
    data: {
      userId: multiCompanyAdmin.id,
      companyId: noPlanCompany.id,
      role: Role.COMPANY_ADMIN,
      appsAccess: [],
    },
  });

  // 5. Pull Test Technician specific user
  await prisma.userPermission.create({
    data: {
      userId: pullTestTechnician.id,
      companyId: silverMiningCorp.id,
      role: Role.COMPANY_USER,
      appsAccess: [Application.PULL_TEST_TECHNICIAN],
    },
  });

  // 6. User with expired plan access
  await prisma.userPermission.create({
    data: {
      userId: expiredUser.id,
      companyId: bronzeMiningCorp.id,
      role: Role.COMPANY_USER,
      appsAccess: [
        Application.PULL_TEST, // Expired plan
        Application.PULL_TEST_OPERATOR, // Valid plan
      ],
    },
  });

  // 7. User with permissions but no app access
  await prisma.userPermission.create({
    data: {
      userId: noAppUser.id,
      companyId: noPlanCompany.id,
      role: Role.COMPANY_USER,
      appsAccess: [], // No app access
    },
  });

  // Create sites for test companies for better testing
  // Gold Mining Corp sites
  const goldSite1 = await prisma.site.create({
    data: {
      siteName: 'Gold Mine Alpha',
      address: '1 Mining Road',
      postalCode: '12345',
      city: 'Stockholm',
      country: 'Sweden',
      companyId: goldMiningCorp.id,
    },
  });

  const goldSite2 = await prisma.site.create({
    data: {
      siteName: 'Gold Mine Beta',
      address: '2 Mining Road',
      postalCode: '12346',
      city: 'Uppsala',
      country: 'Sweden',
      companyId: goldMiningCorp.id,
    },
  });

  // Silver Mining Corp sites
  const silverSite = await prisma.site.create({
    data: {
      siteName: 'Silver Mine Main',
      address: '10 Silver Road',
      postalCode: '23456',
      city: 'Gothenburg',
      country: 'Sweden',
      companyId: silverMiningCorp.id,
    },
  });

  // Bronze Mining Corp sites
  const bronzeSite = await prisma.site.create({
    data: {
      siteName: 'Bronze Mine South',
      address: '15 Bronze Avenue',
      postalCode: '34567',
      city: 'Malmö',
      country: 'Sweden',
      companyId: bronzeMiningCorp.id,
    },
  });

  return [goldMiningCorp, silverMiningCorp, bronzeMiningCorp, noPlanCompany];
}

function generateAustralianNumber() {
  return (
    '+61 4' +
    faker.string.numeric(2) +
    ' ' +
    faker.string.numeric(3) +
    ' ' +
    faker.string.numeric(3)
  );
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
        workPlace: 'Sandvik ' + faker.company.name(),
        phoneNumber: generateAustralianNumber(),
        globalRole: GlobalRole.SANDVIK_ADMIN,
        isGlobalVisibility: true,
      },
    });

    users.push(user);
  }

  return users;
}

async function generateRegularUsers(count: number) {
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
        phoneNumber: generateAustralianNumber(),
        // No globalRole for regular users
        isGlobalVisibility: false,
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
        workPlace: 'Sandvik Field Office',
        phoneNumber: generateAustralianNumber(),
        globalRole: GlobalRole.SANDVIK_TECHNICIAN,
        isGlobalVisibility: false,
      },
    });

    users.push(user);
  }

  return users;
}

async function generateCompanies(
  count: number,
  adminUsers: any[],
  regularUsers: any[],
) {
  const companies = [];
  const applications = [
    Application.PULL_TEST,
    Application.PULL_TEST_TECHNICIAN,
    // Application.BANSHEE,
  ];
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

    // Create plans for company - some companies might not have all applications
    const appsToUse = faker.helpers.arrayElements(
      applications,
      faker.number.int({ min: 1, max: 3 }),
    );

    for (const app of appsToUse) {
      // Add randomness - some plans might be expired
      const isExpired = faker.datatype.boolean(0.2); // 20% chance of expired

      await prisma.plan.create({
        data: {
          companyId: company.id,
          applicationName: app,
          planLevel: faker.helpers.arrayElement(planLevels),
          expiringDate: isExpired ? faker.date.past() : faker.date.future(),
        },
      });
    }

    // Assign admin users permissions to company
    const adminUser = adminUsers[i % adminUsers.length];
    await prisma.userPermission.create({
      data: {
        userId: adminUser.id,
        companyId: company.id,
        role: Role.COMPANY_ADMIN,
        appsAccess: appsToUse,
      },
    });

    // Assign some regular users to this company with different permissions
    const numRegularUsers = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < numRegularUsers; j++) {
      if (regularUsers.length > 0) {
        const regularUser =
          regularUsers[
            faker.number.int({ min: 0, max: regularUsers.length - 1 })
          ];
        const userAppsAccess = faker.helpers.arrayElements(
          appsToUse,
          faker.number.int({ min: 0, max: appsToUse.length }),
        );

        await prisma.userPermission.create({
          data: {
            userId: regularUser.id,
            companyId: company.id,
            role: Role.COMPANY_USER,
            appsAccess: userAppsAccess,
          },
        });
      }
    }

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
      // More location references (chainage in meters)
      const chainage = faker.number.int({ min: 5, max: 300 });
      const location = await prisma.location.create({
        data: {
          locationName: `CH${chainage}`,
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
            !isHazard && faker.datatype.boolean(0.2)
              ? [faker.date.recent({ days: 10 })]
              : [],
          abortReason:
            result === Result.ABORT
              ? faker.helpers.arrayElement(abortReasons)
              : null,
          comment: faker.datatype.boolean(0.6) ? faker.lorem.sentence() : null,
          image: faker.datatype.boolean(0.3) ? faker.image.url() : null,
          createdAt: faker.date.recent({ days: 60 }),
          updatedAt: faker.date.recent({ days: 60 }),
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
