-- AlterTable
ALTER TABLE "bolt_results" ADD COLUMN "measuredAt" TIMESTAMP(3);

-- BackfillData: Copy createdAt to measuredAt for all existing records
UPDATE "bolt_results" SET "measuredAt" = "createdAt" WHERE "measuredAt" IS NULL;

-- AlterTable: Make measuredAt NOT NULL after backfilling
ALTER TABLE "bolt_results" ALTER COLUMN "measuredAt" SET NOT NULL;
