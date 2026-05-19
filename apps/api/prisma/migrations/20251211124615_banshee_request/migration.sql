-- CreateTable
CREATE TABLE "banshee_requests" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "name" TEXT,
    "levelId" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "boltType" "BoltType" NOT NULL,
    "locationDetails" TEXT,
    "boltInstallationDateTime" TIMESTAMP(3),
    "ringPosition" TEXT,
    "comment" TEXT,
    "isBrokenBolt" BOOLEAN NOT NULL,
    "isNotMeasurable" BOOLEAN NOT NULL,
    "images" JSONB,
    "measured" BOOLEAN NOT NULL DEFAULT false,
    "deviceAndMeasurement" JSONB,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "banshee_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "banshee_requests_createdBy_idx" ON "banshee_requests"("createdBy");

-- CreateIndex
CREATE INDEX "banshee_requests_serialNumber_idx" ON "banshee_requests"("serialNumber");

-- AddForeignKey
ALTER TABLE "banshee_requests" ADD CONSTRAINT "banshee_requests_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banshee_requests" ADD CONSTRAINT "banshee_requests_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "drives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banshee_requests" ADD CONSTRAINT "banshee_requests_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
