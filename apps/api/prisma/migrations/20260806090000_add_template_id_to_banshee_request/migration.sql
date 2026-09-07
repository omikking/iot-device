-- AlterTable
ALTER TABLE "banshee_requests" ADD COLUMN     "templateId" TEXT;

-- CreateIndex
CREATE INDEX "banshee_requests_templateId_idx" ON "banshee_requests"("templateId");

-- AddForeignKey
ALTER TABLE "banshee_requests" ADD CONSTRAINT "banshee_requests_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
