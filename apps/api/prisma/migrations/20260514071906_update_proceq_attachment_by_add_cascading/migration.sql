/*
  Warnings:

  - The values [NOT_TESTED_BROKEN_BOLT_NUT,NOT_TESTED_PULL_TEST_COLLAR_INSTALLED_BACKWARDS] on the enum `PullTestAbortReason` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PullTestAbortReason_new" AS ENUM ('NOT_TESTED_VOID_CAVITY', 'TEST_STOPPED_INSTALL_ANGLE', 'PEG_NOT_EXTRUDED', 'HIGH_ANGLE_NOT_PERPENDICULAR', 'REBAR_EJECTED_STOPPER_CAUGHT', 'BOLT_END_DAMAGE_RIG_NOT_ENGAGING', 'PULL_TEST_COLLAR_INSTALLED_BACKWARDS', 'BROKEN_BOLT_NUT');
ALTER TABLE "bolt_results" ALTER COLUMN "abortReason" TYPE "PullTestAbortReason_new" USING ("abortReason"::text::"PullTestAbortReason_new");
ALTER TYPE "PullTestAbortReason" RENAME TO "PullTestAbortReason_old";
ALTER TYPE "PullTestAbortReason_new" RENAME TO "PullTestAbortReason";
DROP TYPE "PullTestAbortReason_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "proceq_attachments" DROP CONSTRAINT "proceq_attachments_proceqDataId_fkey";

-- AddForeignKey
ALTER TABLE "proceq_attachments" ADD CONSTRAINT "proceq_attachments_proceqDataId_fkey" FOREIGN KEY ("proceqDataId") REFERENCES "proceq_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
