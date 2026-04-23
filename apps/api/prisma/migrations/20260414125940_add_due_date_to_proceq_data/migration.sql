-- AlterTable
ALTER TABLE "banshee_requests" ADD COLUMN     "activateNotifications" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "proceq_data" ADD COLUMN     "dueDate" TIMESTAMP(3);
