/*
  Warnings:

  - You are about to drop the column `positionInRingId` on the `bolt_results` table. All the data in the column will be lost.
  - You are about to drop the `positions_in_ring` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `positionInRing` to the `bolt_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bolt_results" DROP CONSTRAINT "bolt_results_positionInRingId_fkey";

-- DropForeignKey
ALTER TABLE "positions_in_ring" DROP CONSTRAINT "positions_in_ring_locationId_fkey";

-- AlterTable
ALTER TABLE "bolt_results" DROP COLUMN "positionInRingId",
ADD COLUMN     "positionInRing" "RingPosition" NOT NULL;

-- DropTable
DROP TABLE "positions_in_ring";
