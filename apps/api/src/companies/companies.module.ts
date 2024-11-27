import { Module } from '@nestjs/common';
import { CompaniesResolver } from './companies.resolver';
import { CompaniesService } from './companies.service';
import { CompanyPlansResolver } from './company-plans.resolver';
import { CompanyUsersResolver } from './company-users.resolver';
import { CompanySitesResolver } from './company-sites.resolver';

@Module({
  providers: [
    CompaniesResolver,
    CompaniesService,
    CompanyPlansResolver,
    CompanyUsersResolver,
    CompanySitesResolver,
  ],
})
export class CompaniesModule {}
