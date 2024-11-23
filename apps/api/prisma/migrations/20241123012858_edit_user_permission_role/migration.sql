/*
  Warnings:

  - You are about to drop the column `companyRole` on the `user_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `globalRole` on the `user_permissions` table. All the data in the column will be lost.
  - Added the required column `role` to the `user_permissions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COMPANY_USER', 'COMPANY_ADMIN', 'SANDVIK_ADMIN', 'SANDVIK_TECHNICIAN');

-- AlterTable
ALTER TABLE "user_permissions" DROP COLUMN "companyRole",
DROP COLUMN "globalRole",
ADD COLUMN     "role" "Role" NOT NULL;

-- DropEnum
DROP TYPE "CompanyRole";
