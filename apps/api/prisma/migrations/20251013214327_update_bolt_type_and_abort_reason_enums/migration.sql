/*
  Warnings:

  - The values [BANSHEE] on the enum `Application` will be removed. If these variants are still used in the database, this will fail.
  - The values [MD47,MDX47] on the enum `BoltType` will be removed. If these variants are still used in the database, this will fail.
  - The values [NOT_TESTED_VOID_CAVITY,TEST_STOPPED_INSTALL_ANGLE] on the enum `PullTestAbortReason` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Application_new" AS ENUM ('PULL_TEST', 'PULL_TEST_TECHNICIAN');
ALTER TABLE "plans" ALTER COLUMN "applicationName" TYPE "Application_new" USING ("applicationName"::text::"Application_new");
ALTER TABLE "user_permissions" ALTER COLUMN "appsAccess" TYPE "Application_new"[] USING ("appsAccess"::text::"Application_new"[]);
ALTER TABLE "invitations" ALTER COLUMN "appsAccess" TYPE "Application_new"[] USING ("appsAccess"::text::"Application_new"[]);
ALTER TYPE "Application" RENAME TO "Application_old";
ALTER TYPE "Application_new" RENAME TO "Application";
DROP TYPE "Application_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "BoltType_new" AS ENUM ('D47_MD_1_8_M', 'D47_MD_2_1_M', 'D47_MD_2_4_M', 'D47_MD_3_0_M', 'D47_MD_3_8_M', 'D47_MDX_1_8_M', 'D47_MDX_2_1_M', 'D47_MDX_2_4_M', 'D47_MDX_3_0_M', 'D47_MDX_3_8_M', 'D47_MDX_4_0_M', 'D39_MDX_1_8_M', 'D39_MDX_2_1_M', 'D39_MDX_2_4_M', 'D39_MDX_3_0_M', 'D47_MDX_PEG_BOLT_1_8_M', 'D47_MDX_PEG_BOLT_2_1_M', 'D47_MDX_PEG_BOLT_2_4_M', 'D47_MDX_PEG_BOLT_3_0_M', 'D39_MDX_PEG_BOLT_1_8_M', 'D39_MDX_PEG_BOLT_2_1_M', 'D39_MDX_PEG_BOLT_2_4_M', 'D39_MDX_PEG_BOLT_3_0_M', 'D47_MD_PEG_BOLT_1_8_M', 'D47_MD_PEG_BOLT_2_1_M', 'D47_MD_PEG_BOLT_2_4_M', 'D47_MD_PEG_BOLT_3_0_M', 'FRICTION_BOLT_47_MM', 'FRICTION_BOLT_39_MM', 'FRICTION_BOLT_33_MM', 'SPIRAL_FRICTION_BOLT', 'KINLOC_BOLT', 'KINLOC_BOLT_INDIE');
ALTER TABLE "bolt_results" ALTER COLUMN "boltType" TYPE "BoltType_new" USING ("boltType"::text::"BoltType_new");
ALTER TYPE "BoltType" RENAME TO "BoltType_old";
ALTER TYPE "BoltType_new" RENAME TO "BoltType";
DROP TYPE "BoltType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PullTestAbortReason_new" AS ENUM ('PEG_NOT_EXTRUDED', 'HIGH_ANGLE_NOT_PERPENDICULAR', 'REBAR_EJECTED_STOPPER_CAUGHT', 'BOLT_END_DAMAGE_RIG_NOT_ENGAGING');
ALTER TABLE "bolt_results" ALTER COLUMN "abortReason" TYPE "PullTestAbortReason_new" USING ("abortReason"::text::"PullTestAbortReason_new");
ALTER TYPE "PullTestAbortReason" RENAME TO "PullTestAbortReason_old";
ALTER TYPE "PullTestAbortReason_new" RENAME TO "PullTestAbortReason";
DROP TYPE "PullTestAbortReason_old";
COMMIT;
