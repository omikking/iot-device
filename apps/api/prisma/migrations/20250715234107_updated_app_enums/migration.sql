/*
  Warnings:

  - The values [XCYCLOPS,ULTRABOLTS] on the enum `Application` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[siteName]` on the table `sites` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Application_new" AS ENUM ('PULL_TEST', 'PULL_TEST_OPERATOR', 'BANSHEE');
ALTER TABLE "plans" ALTER COLUMN "applicationName" TYPE "Application_new" USING ("applicationName"::text::"Application_new");
ALTER TABLE "user_permissions" ALTER COLUMN "appsAccess" TYPE "Application_new"[] USING ("appsAccess"::text::"Application_new"[]);
ALTER TYPE "Application" RENAME TO "Application_old";
ALTER TYPE "Application_new" RENAME TO "Application";
DROP TYPE "Application_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "sites_siteName_key" ON "sites"("siteName");
