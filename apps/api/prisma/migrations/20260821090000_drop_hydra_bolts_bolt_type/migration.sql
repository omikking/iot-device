-- Makes `opticbolt_test_results.bolt_type` the single source of truth for a
-- bolt's type and drops the duplicate on `hydra_bolts`.
--
-- A Hydra Bolt's type is derived at read time by joining on the serial number:
--   hydra_bolts.serialNumber
--     -> opticbolt_test_results.serial_number / .bolt_type  (factory test record)
--       -> hydrabolt.part_number                            (bolt catalogue)
-- so the column here was a second, independently-writable copy of the same fact.
--
-- DESTRUCTIVE: `hydra_bolts.boltType` is dropped. It is safe to lose only where
-- every bolt has a matching `opticbolt_test_results` row. The guard below aborts
-- the migration if any serial number would lose its type with nothing to derive
-- it from, so this fails loudly instead of silently discarding data.
--
-- Deliberately EXCLUDED: `prisma migrate diff` also
-- wants to drop `banshee_requests.templateId`. That column is pre-existing drift
-- from a `db push`, exists in no migration and no version of schema.prisma, and
-- holds data. It is unrelated to this change and is left alone.

DO $$
DECLARE
  orphaned INT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hydra_bolts' AND column_name = 'boltType'
  ) THEN
    RETURN;  -- already dropped (e.g. by an earlier `db push`)
  END IF;

  SELECT count(*) INTO orphaned
  FROM "hydra_bolts" hb
  WHERE NULLIF(btrim(hb."boltType"), '') IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM "opticbolt_test_results" otr
      WHERE otr."serial_number" = hb."serialNumber"
        AND NULLIF(btrim(otr."bolt_type"), '') IS NOT NULL
    );

  IF orphaned > 0 THEN
    RAISE EXCEPTION
      'Cannot drop hydra_bolts.boltType: % row(s) have a bolt type with no matching opticbolt_test_results.bolt_type to derive it from. Backfill opticbolt_test_results for those serial numbers first.',
      orphaned;
  END IF;

  ALTER TABLE "hydra_bolts" DROP COLUMN "boltType";
END $$;
