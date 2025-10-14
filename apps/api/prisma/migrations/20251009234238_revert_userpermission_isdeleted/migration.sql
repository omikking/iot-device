/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `user_permissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_permissions" DROP COLUMN "isDeleted";
