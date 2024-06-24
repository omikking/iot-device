/*
  Warnings:

  - Made the column `type` on table `coffees` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "coffees" ALTER COLUMN "type" SET NOT NULL;
