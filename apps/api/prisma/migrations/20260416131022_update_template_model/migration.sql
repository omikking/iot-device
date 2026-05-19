/*
  Warnings:

  - You are about to drop the column `templateId` on the `banshee_event_logs` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `proceq_data` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "proceq_data" DROP CONSTRAINT "proceq_data_templateId_fkey";

-- AlterTable
ALTER TABLE "banshee_event_logs" DROP COLUMN "templateId";

-- AlterTable
ALTER TABLE "proceq_data" DROP COLUMN "templateId";
