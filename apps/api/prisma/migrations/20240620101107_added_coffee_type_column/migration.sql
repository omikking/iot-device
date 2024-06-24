-- CreateEnum
CREATE TYPE "CoffeeType" AS ENUM ('ARABICA', 'ROBUSTA');

-- AlterTable
ALTER TABLE "coffees" ADD COLUMN     "type" "CoffeeType";
