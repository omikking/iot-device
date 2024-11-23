/*
  Warnings:

  - You are about to drop the column `address` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `sites` table. All the data in the column will be lost.
  - Added the required column `adress` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adress` to the `sites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "address",
ADD COLUMN     "adress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sites" DROP COLUMN "address",
ADD COLUMN     "adress" TEXT NOT NULL;
