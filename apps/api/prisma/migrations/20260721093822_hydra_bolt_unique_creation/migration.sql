/*
  Warnings:

  - A unique constraint covering the columns `[part_number]` on the table `hydrabolt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "hydrabolt_part_number_key" ON "hydrabolt"("part_number");
