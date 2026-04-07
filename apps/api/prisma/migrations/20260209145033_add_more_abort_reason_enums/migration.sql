-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PullTestAbortReason" ADD VALUE 'PULL_TEST_COLLAR_INSTALLED_BACKWARDS';
ALTER TYPE "PullTestAbortReason" ADD VALUE 'BROKEN_BOLT_NUT';
