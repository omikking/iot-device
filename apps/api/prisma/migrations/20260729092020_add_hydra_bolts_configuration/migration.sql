-- CreateTable
CREATE TABLE "hydra_bolts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "name" TEXT,
    "levelId" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "coordinates" JSONB,
    "boltType" VARCHAR(100) NOT NULL,
    "locationDetails" TEXT,
    "boltInstallationDateTime" TIMESTAMP(3),
    "ringPosition" "RingPosition" NOT NULL,
    "comment" TEXT,
    "activateNotifications" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "companyId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,

    CONSTRAINT "hydra_bolts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hydra_bolts_serialNumber_key" ON "hydra_bolts"("serialNumber");

-- CreateIndex
CREATE INDEX "hydra_bolts_createdBy_idx" ON "hydra_bolts"("createdBy");

-- CreateIndex
CREATE INDEX "hydra_bolts_serialNumber_idx" ON "hydra_bolts"("serialNumber");

-- CreateIndex
CREATE INDEX "hydra_bolts_companyId_idx" ON "hydra_bolts"("companyId");

-- CreateIndex
CREATE INDEX "hydra_bolts_siteId_idx" ON "hydra_bolts"("siteId");

-- AddForeignKey
ALTER TABLE "hydra_bolts" ADD CONSTRAINT "hydra_bolts_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hydra_bolts" ADD CONSTRAINT "hydra_bolts_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "drives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hydra_bolts" ADD CONSTRAINT "hydra_bolts_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hydra_bolts" ADD CONSTRAINT "hydra_bolts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hydra_bolts" ADD CONSTRAINT "hydra_bolts_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
