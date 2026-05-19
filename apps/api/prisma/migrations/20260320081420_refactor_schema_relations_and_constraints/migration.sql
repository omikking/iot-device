/*
  Warnings:

  - You are about to drop the column `deviceAndMeasurement` on the `banshee_requests` table. All the data in the column will be lost.
  - The `images` column on the `banshee_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[serialNumber]` on the table `banshee_requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `banshee_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteId` to the `banshee_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ringPosition` to the `banshee_requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProceqStatus" AS ENUM ('ELASTIC', 'LOW_PLASTIC', 'HIGH_PLASTIC', 'BROKEN', 'NOT_MEASURABLE', 'UNMEASURED');

-- AlterEnum
ALTER TYPE "Application" ADD VALUE 'BANSHEE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PullTestAbortReason" ADD VALUE 'NOT_TESTED_BROKEN_BOLT_NUT';
ALTER TYPE "PullTestAbortReason" ADD VALUE 'NOT_TESTED_PULL_TEST_COLLAR_INSTALLED_BACKWARDS';

-- AlterTable
ALTER TABLE "banshee_requests" DROP COLUMN "deviceAndMeasurement",
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "coordinates" JSONB,
ADD COLUMN     "isProceqSynced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "siteId" TEXT NOT NULL,
DROP COLUMN "ringPosition",
ADD COLUMN     "ringPosition" "RingPosition" NOT NULL,
DROP COLUMN "images",
ADD COLUMN     "images" TEXT[];

-- CreateTable
CREATE TABLE "banshee_bolt_type_constants" (
    "id" TEXT NOT NULL,
    "boltType" "BoltType" NOT NULL,
    "velocity" DOUBLE PRECISION NOT NULL,
    "tempCorrectionFactor" DOUBLE PRECISION NOT NULL,
    "tempCoeff" DOUBLE PRECISION NOT NULL,
    "quadCoeff1" DOUBLE PRECISION NOT NULL,
    "linCoeff1" DOUBLE PRECISION NOT NULL,
    "quadCoeff2" DOUBLE PRECISION NOT NULL,
    "linCoeff2" DOUBLE PRECISION NOT NULL,
    "constTerm" DOUBLE PRECISION NOT NULL,
    "nominalLength" DOUBLE PRECISION NOT NULL,
    "linearLimit" DOUBLE PRECISION NOT NULL,
    "elasticLimit" DOUBLE PRECISION NOT NULL,
    "lowPlasticLimit" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banshee_bolt_type_constants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banshee_event_logs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),
    "eventType" TEXT NOT NULL,
    "previousStatus" "ProceqStatus" NOT NULL,
    "newStatus" "ProceqStatus" NOT NULL,
    "measurementId" TEXT,
    "bansheeRequestId" TEXT NOT NULL,

    CONSTRAINT "banshee_event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proceq_data" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "measurementId" TEXT NOT NULL,
    "operatorEmail" TEXT,
    "comments" TEXT,
    "temperature" DOUBLE PRECISION,
    "userPhoto" JSONB,
    "rawDataZipId" TEXT,
    "rawDataZipPath" TEXT,
    "createdTimestamp" TIMESTAMP(3),
    "updatedTimestamp" TIMESTAMP(3),
    "status" "ProceqStatus",
    "bansheeRequestId" TEXT,

    CONSTRAINT "proceq_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proceq_readings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "readingIndex" INTEGER NOT NULL DEFAULT 0,
    "indicationSetupFileName" TEXT,
    "measuringMode" TEXT,
    "frequency" DOUBLE PRECISION,
    "gain" DOUBLE PRECISION,
    "voltage" INTEGER,
    "sampleAveraging" INTEGER,
    "damping" INTEGER,
    "analogueFilter" INTEGER,
    "zeroOffset" DOUBLE PRECISION,
    "velocity" DOUBLE PRECISION,
    "level" DOUBLE PRECISION,
    "measurementLevel" DOUBLE PRECISION,
    "referenceSamplingRate" INTEGER,
    "start" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "gate1MaximumAmplitude" DOUBLE PRECISION,
    "gate1SoundPathDistance" DOUBLE PRECISION,
    "gate1SoundPathDistanceInTimeUnit" DOUBLE PRECISION,
    "status" "ProceqStatus",
    "elongation" DOUBLE PRECISION,
    "proceqDataId" TEXT NOT NULL,

    CONSTRAINT "proceq_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proceq_tokens" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "operatorEmail" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proceq_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proceq_attachments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attachmentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "attachmentType" TEXT NOT NULL,
    "description" TEXT,
    "proceqDataId" TEXT NOT NULL,

    CONSTRAINT "proceq_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banshee_session_stats" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "totalMeasured" INTEGER NOT NULL DEFAULT 0,
    "notMeasurable" INTEGER NOT NULL DEFAULT 0,
    "broken" INTEGER NOT NULL DEFAULT 0,
    "companyId" TEXT,
    "siteId" TEXT,

    CONSTRAINT "banshee_session_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "banshee_event_logs_bansheeRequestId_idx" ON "banshee_event_logs"("bansheeRequestId");

-- CreateIndex
CREATE INDEX "banshee_event_logs_createdAt_idx" ON "banshee_event_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "proceq_data_measurementId_key" ON "proceq_data"("measurementId");

-- CreateIndex
CREATE UNIQUE INDEX "proceq_readings_proceqDataId_readingIndex_key" ON "proceq_readings"("proceqDataId", "readingIndex");

-- CreateIndex
CREATE UNIQUE INDEX "proceq_tokens_operatorEmail_key" ON "proceq_tokens"("operatorEmail");

-- CreateIndex
CREATE UNIQUE INDEX "proceq_attachments_attachmentId_key" ON "proceq_attachments"("attachmentId");

-- CreateIndex
CREATE UNIQUE INDEX "banshee_session_stats_companyId_siteId_sessionDate_key" ON "banshee_session_stats"("companyId", "siteId", "sessionDate");

-- CreateIndex
CREATE UNIQUE INDEX "banshee_requests_serialNumber_key" ON "banshee_requests"("serialNumber");

-- CreateIndex
CREATE INDEX "banshee_requests_companyId_idx" ON "banshee_requests"("companyId");

-- CreateIndex
CREATE INDEX "banshee_requests_siteId_idx" ON "banshee_requests"("siteId");

-- AddForeignKey
ALTER TABLE "banshee_requests" ADD CONSTRAINT "banshee_requests_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banshee_requests" ADD CONSTRAINT "banshee_requests_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banshee_event_logs" ADD CONSTRAINT "banshee_event_logs_bansheeRequestId_fkey" FOREIGN KEY ("bansheeRequestId") REFERENCES "banshee_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proceq_data" ADD CONSTRAINT "proceq_data_bansheeRequestId_fkey" FOREIGN KEY ("bansheeRequestId") REFERENCES "banshee_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proceq_readings" ADD CONSTRAINT "proceq_readings_proceqDataId_fkey" FOREIGN KEY ("proceqDataId") REFERENCES "proceq_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proceq_attachments" ADD CONSTRAINT "proceq_attachments_proceqDataId_fkey" FOREIGN KEY ("proceqDataId") REFERENCES "proceq_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banshee_session_stats" ADD CONSTRAINT "banshee_session_stats_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banshee_session_stats" ADD CONSTRAINT "banshee_session_stats_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;
