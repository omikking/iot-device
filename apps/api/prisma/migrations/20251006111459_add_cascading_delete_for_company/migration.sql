/*
  Warnings:

  - Made the column `companyId` on table `invitations` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_companyId_fkey";

-- AlterTable
ALTER TABLE "invitations" ALTER COLUMN "companyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
