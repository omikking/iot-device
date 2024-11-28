import { Module } from '@nestjs/common';
import { CompaniesResolver } from './companies.resolver';
import { CompaniesService } from './companies.service';
import { CompanyUserPermissionsResolver } from './company-userPermissions.resolver';

@Module({
  providers: [
    CompaniesResolver,
    CompaniesService,
    CompanyUserPermissionsResolver,
  ],
})
export class CompaniesModule {}
