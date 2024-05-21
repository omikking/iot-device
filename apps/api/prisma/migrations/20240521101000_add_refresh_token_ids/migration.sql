-- CreateTable
CREATE TABLE "refresh_token_ids" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refreshTokenId" TEXT NOT NULL,

    CONSTRAINT "refresh_token_ids_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_ids_refreshTokenId_key" ON "refresh_token_ids"("refreshTokenId");
