-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_companyId_fkey";

-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "globalRole" "GlobalRole",
ALTER COLUMN "companyId" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
