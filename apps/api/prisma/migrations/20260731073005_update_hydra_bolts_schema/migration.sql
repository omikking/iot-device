-- Brings `hydra_bolts` to its final shape: timestamptz columns, bounded
-- varchars, a required `name`, and uuid-typed `createdBy` / `updatedBy`.
--
-- Written to be safe on environments that are in either of two states:
--   * the table already exists from 20260729092020 -> altered in place, rows kept
--   * the table is absent (local DBs where it was dropped) -> created outright
-- The in-place branch casts text -> uuid with USING instead of the
-- drop-and-recreate Prisma generates by default, which destroys the values and
-- fails outright on a non-empty table because the re-added column is NOT NULL.

DO $$
BEGIN
  IF to_regclass('public.hydra_bolts') IS NULL THEN

    CREATE TABLE "hydra_bolts" (
      "id" TEXT NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMPTZ NOT NULL,
      "serialNumber" VARCHAR(100) NOT NULL,
      "name" VARCHAR(255) NOT NULL,
      "levelId" TEXT NOT NULL,
      "driveId" TEXT NOT NULL,
      "locationId" TEXT NOT NULL,
      "coordinates" JSONB,
      "boltType" VARCHAR(100) NOT NULL,
      "locationDetails" TEXT,
      "boltInstallationDateTime" TIMESTAMPTZ,
      "ringPosition" "RingPosition" NOT NULL,
      "comment" TEXT,
      "activateNotifications" BOOLEAN NOT NULL DEFAULT false,
      "createdBy" UUID NOT NULL,
      "updatedBy" UUID,
      "companyId" TEXT NOT NULL,
      "siteId" TEXT NOT NULL,

      CONSTRAINT "hydra_bolts_pkey" PRIMARY KEY ("id")
    );

    ALTER TABLE "hydra_bolts" ADD CONSTRAINT "hydra_bolts_levelId_fkey"
      FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE "hydra_bolts" ADD CONSTRAINT "hydra_bolts_driveId_fkey"
      FOREIGN KEY ("driveId") REFERENCES "drives"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE "hydra_bolts" ADD CONSTRAINT "hydra_bolts_locationId_fkey"
      FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE "hydra_bolts" ADD CONSTRAINT "hydra_bolts_companyId_fkey"
      FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE "hydra_bolts" ADD CONSTRAINT "hydra_bolts_siteId_fkey"
      FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

  ELSE

    ALTER TABLE "hydra_bolts"
      ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
      ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ,
      ALTER COLUMN "serialNumber" SET DATA TYPE VARCHAR(100),
      ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
      ALTER COLUMN "name" SET NOT NULL,
      ALTER COLUMN "boltInstallationDateTime" SET DATA TYPE TIMESTAMPTZ,
      ALTER COLUMN "createdBy" SET DATA TYPE UUID USING "createdBy"::uuid,
      ALTER COLUMN "updatedBy" SET DATA TYPE UUID USING "updatedBy"::uuid;

  END IF;
END $$;

-- `serialNumber` keeps its unique index, which already serves lookups, so the
-- plain btree from 20260729092020 is redundant.
DROP INDEX IF EXISTS "hydra_bolts_serialNumber_idx";

CREATE UNIQUE INDEX IF NOT EXISTS "hydra_bolts_serialNumber_key" ON "hydra_bolts"("serialNumber");
CREATE INDEX IF NOT EXISTS "hydra_bolts_createdBy_idx" ON "hydra_bolts"("createdBy");
CREATE INDEX IF NOT EXISTS "hydra_bolts_companyId_idx" ON "hydra_bolts"("companyId");
CREATE INDEX IF NOT EXISTS "hydra_bolts_siteId_idx" ON "hydra_bolts"("siteId");
