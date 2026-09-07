-- Collapse the two "no usable measurement" statuses into one.
--
-- UNMEASURED was the fallback the sync wrote when a reading carried no status of
-- its own; NOT_MEASURABLE is what the operator's comment records. The product
-- only ever surfaced one term ("Not Measurable") for both, so the distinction is
-- dropped here and every UNMEASURED row is rewritten to NOT_MEASURABLE.
--
-- This is a one-way migration: once rewritten, the rows that used to be
-- UNMEASURED can no longer be told apart from operator-flagged NOT_MEASURABLE.

-- 1. Rewrite existing data on every column typed ProceqStatus.
UPDATE "proceq_data"
SET "status" = 'NOT_MEASURABLE'
WHERE "status" = 'UNMEASURED';

UPDATE "proceq_readings"
SET "status" = 'NOT_MEASURABLE'
WHERE "status" = 'UNMEASURED';

UPDATE "banshee_event_logs"
SET "previousStatus" = 'NOT_MEASURABLE'
WHERE "previousStatus" = 'UNMEASURED';

UPDATE "banshee_event_logs"
SET "newStatus" = 'NOT_MEASURABLE'
WHERE "newStatus" = 'UNMEASURED';

-- 2. Postgres cannot drop a value from an enum in place, so the type is
--    recreated without UNMEASURED and every column re-pointed at it.
ALTER TYPE "ProceqStatus" RENAME TO "ProceqStatus_old";

CREATE TYPE "ProceqStatus" AS ENUM ('ELASTIC', 'LOW_PLASTIC', 'HIGH_PLASTIC', 'BROKEN', 'NOT_MEASURABLE');

ALTER TABLE "proceq_data"
  ALTER COLUMN "status" TYPE "ProceqStatus" USING ("status"::text::"ProceqStatus");

ALTER TABLE "proceq_readings"
  ALTER COLUMN "status" TYPE "ProceqStatus" USING ("status"::text::"ProceqStatus");

ALTER TABLE "banshee_event_logs"
  ALTER COLUMN "previousStatus" TYPE "ProceqStatus" USING ("previousStatus"::text::"ProceqStatus"),
  ALTER COLUMN "newStatus" TYPE "ProceqStatus" USING ("newStatus"::text::"ProceqStatus");

DROP TYPE "ProceqStatus_old";
