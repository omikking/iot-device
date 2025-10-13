import { PrismaClient, GlobalRole } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

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

  console.log('✅ Database cleaned');
}

async function main() {
  console.log('🌱 Starting minimal seeding...');

  // Check if we should clean first (based on command line argument)
  const shouldClean = process.argv.includes('--clean');

  if (shouldClean) {
    await cleanup();
  }

  // Create a global Sandvik admin user
  const passwordHash = await argon.hash('Password123!');

  const sandvikAdmin = await prisma.user.create({
    data: {
      email: 'sandvikadmin@mail.com',
      hash: passwordHash,
      fullName: 'Sandvik Admin',
      workPlace: 'Sandvik',
      phoneNumber: '+46123456789',
      globalRole: GlobalRole.SANDVIK_ADMIN,
      isGlobalVisibility: true,
    },
  });

  console.log('\n🔑 ADMIN TEST ACCOUNT CREATED');
  console.log('=====================================');
  console.log('Email: sandvikadmin@mail.com');
  console.log('Password: Password123!');
  console.log('=====================================');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
