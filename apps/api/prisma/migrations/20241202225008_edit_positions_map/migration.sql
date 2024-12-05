/*
  Warnings:

  - You are about to drop the `positions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bolt_results" DROP CONSTRAINT "bolt_results_positionInRingId_fkey";

-- DropForeignKey
ALTER TABLE "positions" DROP CONSTRAINT "positions_locationId_fkey";

-- DropTable
DROP TABLE "positions";

-- CreateTable
CREATE TABLE "positions_in_ring" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "positionInRingName" "RingPosition" NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "positions_in_ring_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "positions_in_ring" ADD CONSTRAINT "positions_in_ring_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bolt_results" ADD CONSTRAINT "bolt_results_positionInRingId_fkey" FOREIGN KEY ("positionInRingId") REFERENCES "positions_in_ring"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
