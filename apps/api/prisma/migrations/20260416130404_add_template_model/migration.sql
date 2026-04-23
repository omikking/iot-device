-- AlterTable
ALTER TABLE "banshee_event_logs" ADD COLUMN     "templateId" TEXT;

-- AlterTable
ALTER TABLE "proceq_data" ADD COLUMN     "templateId" TEXT;

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "templateName" TEXT,
    "period" INTEGER NOT NULL DEFAULT 0,
    "boltInstallationDateTime" TIMESTAMP(3),
    "siteId" TEXT,
    "levelId" TEXT,
    "driveId" TEXT,
    "locationId" TEXT,
    "locationDetails" TEXT,
    "coordinates" JSONB,
    "activateNotifications" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "companyId" TEXT NOT NULL,
    "ringPosition" "RingPosition",

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "templates_companyId_idx" ON "templates"("companyId");

-- AddForeignKey
ALTER TABLE "proceq_data" ADD CONSTRAINT "proceq_data_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "drives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
