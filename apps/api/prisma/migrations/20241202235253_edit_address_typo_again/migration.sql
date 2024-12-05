/*
  Warnings:

  - You are about to drop the column `adress` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `adress` on the `sites` table. All the data in the column will be lost.
  - Added the required column `address` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `sites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sites" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT NOT NULL;
