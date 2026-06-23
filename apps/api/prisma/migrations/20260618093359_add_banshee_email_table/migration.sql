-- CreateEnum
CREATE TYPE "BansheeEmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "BansheeEmail" (
    "id" TEXT NOT NULL,
    "status" "BansheeEmailStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BansheeEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BansheeEmailAttachment" (
    "id" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "storedFileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "bansheeEmailId" TEXT NOT NULL,

    CONSTRAINT "BansheeEmailAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BansheeEmail_userId_idx" ON "BansheeEmail"("userId");

-- CreateIndex
CREATE INDEX "BansheeEmail_companyId_idx" ON "BansheeEmail"("companyId");

-- CreateIndex
CREATE INDEX "BansheeEmailAttachment_bansheeEmailId_idx" ON "BansheeEmailAttachment"("bansheeEmailId");

-- CreateIndex
CREATE INDEX "BansheeEmailAttachment_createdAt_idx" ON "BansheeEmailAttachment"("createdAt");

-- AddForeignKey
ALTER TABLE "BansheeEmail" ADD CONSTRAINT "BansheeEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BansheeEmail" ADD CONSTRAINT "BansheeEmail_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BansheeEmailAttachment" ADD CONSTRAINT "BansheeEmailAttachment_bansheeEmailId_fkey" FOREIGN KEY ("bansheeEmailId") REFERENCES "BansheeEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
