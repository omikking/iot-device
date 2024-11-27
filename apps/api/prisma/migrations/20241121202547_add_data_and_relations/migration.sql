/*
  Warnings:

  - The primary key for the `companies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `companyCode` on the `companies` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_CompanyToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bolts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orgNumber]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyContactEmail` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgNumber` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workPlace` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompanyRole" AS ENUM ('COMPANY_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('SANDVIK_ADMIN', 'SANDVIK_TECHNICIAN');

-- CreateEnum
CREATE TYPE "Result" AS ENUM ('PASS', 'FAIL', 'ABORT');

-- CreateEnum
CREATE TYPE "PullTestAbortReason" AS ENUM ('NOT_TESTED_VOID_CAVITY', 'TEST_STOPPED_INSTALL_ANGLE');

-- CreateEnum
CREATE TYPE "Application" AS ENUM ('PULL_TEST', 'PULL_TEST_OPERATOR', 'XCYCLOPS', 'ULTRABOLTS');

-- CreateEnum
CREATE TYPE "PlanLevel" AS ENUM ('GOLD', 'SILVER', 'BRONZE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BoltType" AS ENUM ('MD47', 'MDX47');

-- CreateEnum
CREATE TYPE "RingPosition" AS ENUM ('RH_BACKS', 'RH_SHOULDER', 'RH_WALL_UPPER', 'LH_BACKS', 'LH_SHOULDER', 'LH_WALL_UPPER', 'CENTER_BACKS');

-- DropForeignKey
ALTER TABLE "_CompanyToUser" DROP CONSTRAINT "_CompanyToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToUser" DROP CONSTRAINT "_CompanyToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "bolts" DROP CONSTRAINT "bolts_userId_fkey";

-- DropIndex
DROP INDEX "companies_companyCode_key";

-- AlterTable
ALTER TABLE "companies" DROP CONSTRAINT "companies_pkey",
DROP COLUMN "companyCode",
ADD COLUMN     "companyContactEmail" TEXT NOT NULL,
ADD COLUMN     "orgNumber" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "companies_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "globalRole" "GlobalRole",
ADD COLUMN     "isGlobalVisibility" BOOLEAN,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "workPlace" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- DropTable
DROP TABLE "_CompanyToUser";

-- DropTable
DROP TABLE "bolts";

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationName" "Application" NOT NULL,
    "planLevel" "PlanLevel" NOT NULL,
    "expiringDate" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyRole" "CompanyRole" NOT NULL,
    "globalRole" "GlobalRole" NOT NULL,
    "appsAccess" "Application"[],
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levels" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "levelName" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drives" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "driveName" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,

    CONSTRAINT "drives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationName" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "positionInRingName" "RingPosition" NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bolt_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "boltNumber" INTEGER NOT NULL,
    "boltType" "BoltType" NOT NULL,
    "peakLoad" INTEGER[],
    "peakDisplacement" INTEGER[],
    "result" "Result" NOT NULL,
    "isHazard" BOOLEAN NOT NULL DEFAULT false,
    "hazardCompletedDate" TIMESTAMP(3)[],
    "abortReason" "PullTestAbortReason",
    "comment" TEXT,
    "image" TEXT,
    "siteId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "positionInRingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "bolt_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_orgNumber_key" ON "companies"("orgNumber");

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "levels" ADD CONSTRAINT "levels_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drives" ADD CONSTRAINT "drives_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "drives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bolt_results" ADD CONSTRAINT "bolt_results_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bolt_results" ADD CONSTRAINT "bolt_results_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bolt_results" ADD CONSTRAINT "bolt_results_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "drives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bolt_results" ADD CONSTRAINT "bolt_results_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bolt_results" ADD CONSTRAINT "bolt_results_positionInRingId_fkey" FOREIGN KEY ("positionInRingId") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bolt_results" ADD CONSTRAINT "bolt_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
