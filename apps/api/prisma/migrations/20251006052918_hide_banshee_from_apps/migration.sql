/*
  Warnings:

  - The values [BANSHEE] on the enum `Application` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Application_new" AS ENUM ('PULL_TEST', 'PULL_TEST_OPERATOR');
ALTER TABLE "plans" ALTER COLUMN "applicationName" TYPE "Application_new" USING ("applicationName"::text::"Application_new");
ALTER TABLE "user_permissions" ALTER COLUMN "appsAccess" TYPE "Application_new"[] USING ("appsAccess"::text::"Application_new"[]);
ALTER TABLE "invitations" ALTER COLUMN "appsAccess" TYPE "Application_new"[] USING ("appsAccess"::text::"Application_new"[]);
ALTER TYPE "Application" RENAME TO "Application_old";
ALTER TYPE "Application_new" RENAME TO "Application";
DROP TYPE "Application_old";
COMMIT;
