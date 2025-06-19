-- DropForeignKey
ALTER TABLE "bolt_results" DROP CONSTRAINT "bolt_results_siteId_fkey";

-- AddForeignKey
ALTER TABLE "bolt_results" ADD CONSTRAINT "bolt_results_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
