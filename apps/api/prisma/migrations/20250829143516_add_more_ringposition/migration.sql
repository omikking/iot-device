-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RingPosition" ADD VALUE 'RH_WALL_CENTER';
ALTER TYPE "RingPosition" ADD VALUE 'RH_WALL_LOWER';
ALTER TYPE "RingPosition" ADD VALUE 'RH_FACE_HIGH';
ALTER TYPE "RingPosition" ADD VALUE 'RH_FACE_LOW';
ALTER TYPE "RingPosition" ADD VALUE 'LH_WALL_CENTER';
ALTER TYPE "RingPosition" ADD VALUE 'LH_WALL_LOWER';
ALTER TYPE "RingPosition" ADD VALUE 'LH_FACE_HIGH';
ALTER TYPE "RingPosition" ADD VALUE 'LH_FACE_LOW';
