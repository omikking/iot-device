-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BoltType" ADD VALUE 'FRICTION_BOLT_47_MM_1_8_M';
ALTER TYPE "BoltType" ADD VALUE 'FRICTION_BOLT_47_MM_2_1_M';
ALTER TYPE "BoltType" ADD VALUE 'FRICTION_BOLT_47_MM_2_4_M';
ALTER TYPE "BoltType" ADD VALUE 'FRICTION_BOLT_47_MM_3_0_M';
