/*
  Warnings:

  - Made the column `templateName` on table `templates` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "templates" ALTER COLUMN "templateName" SET NOT NULL;
