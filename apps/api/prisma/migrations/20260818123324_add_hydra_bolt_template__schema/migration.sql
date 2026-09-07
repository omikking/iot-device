-- Adds the `hydra_bolt_template` table and links `hydra_bolts` to it via a
-- nullable `templateId`. Purely additive: no column is dropped or retyped, so
-- existing `hydra_bolts` rows survive untouched and pick up a NULL template.
--
-- Deliberately EXCLUDED from this migration: `prisma migrate diff` also wants to
-- drop `banshee_requests.templateId` (plus its index and FK). That column exists
-- in some databases but in no migration and in no version of schema.prisma, i.e.
-- it is pre-existing drift from a `db push`, and it holds data. Dropping it here
-- would destroy that data and is unrelated to this change, so it is left alone
-- and tracked separately.
--
-- Guarded with IF NOT EXISTS because `db push` has been used against dev
-- databases in this repo, so parts of this shape may already be present.

CREATE TABLE IF NOT EXISTS "hydra_bolt_template" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "coordinates" JSONB,
    "locationDetails" TEXT,
    "boltInstallationDateTime" TIMESTAMPTZ,
    "ringPosition" "RingPosition",
    "comment" TEXT,
    "activateNotifications" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" UUID NOT NULL,
    "updatedBy" UUID,
    "companyId" TEXT NOT NULL,
    "siteId" TEXT,
    "levelId" TEXT,
    "driveId" TEXT,
    "locationId" TEXT,

    CONSTRAINT "hydra_bolt_template_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "hydra_bolt_template_createdBy_idx" ON "hydra_bolt_template"("createdBy");
CREATE INDEX IF NOT EXISTS "hydra_bolt_template_companyId_idx" ON "hydra_bolt_template"("companyId");
CREATE INDEX IF NOT EXISTS "hydra_bolt_template_siteId_idx" ON "hydra_bolt_template"("siteId");

-- TEXT, not UUID: `hydra_bolt_template.id` is a TEXT `@default(uuid())` column
-- like every other id in this schema. A UUID column here cannot be used as a
-- foreign key against it -- Postgres rejects the constraint with "key columns
-- are of incompatible types: uuid and text".
ALTER TABLE "hydra_bolts" ADD COLUMN IF NOT EXISTS "templateId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'hydra_bolts_templateId_fkey'
  ) THEN
    ALTER TABLE "hydra_bolts" ADD CONSTRAINT "hydra_bolts_templateId_fkey"
      FOREIGN KEY ("templateId") REFERENCES "hydra_bolt_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'hydra_bolt_template_siteId_fkey'
  ) THEN
    ALTER TABLE "hydra_bolt_template" ADD CONSTRAINT "hydra_bolt_template_siteId_fkey"
      FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE "hydra_bolt_template" ADD CONSTRAINT "hydra_bolt_template_levelId_fkey"
      FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE "hydra_bolt_template" ADD CONSTRAINT "hydra_bolt_template_driveId_fkey"
      FOREIGN KEY ("driveId") REFERENCES "drives"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE "hydra_bolt_template" ADD CONSTRAINT "hydra_bolt_template_locationId_fkey"
      FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE "hydra_bolt_template" ADD CONSTRAINT "hydra_bolt_template_companyId_fkey"
      FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
