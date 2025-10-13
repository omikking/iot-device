import { PrismaClient, GlobalRole } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function cleanup() {
  console.log('🧹 Cleaning up existing data...');

  // Delete data in reverse order of dependencies
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
    prisma.user.deleteMany(), // Clear all users for a fresh start
  ]);

  console.log('✅ Database cleaned');
}

async function main() {
  console.log('🌱 Starting minimal seeding...');

  // Clear existing data
  await cleanup();

  // Create a global Sandvik admin user
  const passwordHash = await argon.hash('Password123!');

  const sandvikAdmin = await prisma.user.create({
    data: {
      email: 'felix.ostergren@sandvik.com',
      hash: passwordHash,
      fullName: 'Felix Östergren',
      workPlace: 'Sandvik',
      phoneNumber: '+46123456789',
      globalRole: GlobalRole.SANDVIK_ADMIN,
      isGlobalVisibility: false,
    },
  });

  console.log('\n🔑 ADMIN ACCOUNT CREATED');
  console.log('=====================================');
  console.log('Email: felix.ostergren@sandvik.com');
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
