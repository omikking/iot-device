/*
  Warnings:

  - You are about to drop the column `type` on the `coffees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "coffees" DROP COLUMN "type";

-- DropEnum
DROP TYPE "CoffeeType";
