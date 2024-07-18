import { Module } from '@nestjs/common';
import { CompaniesResolver } from './companies.resolver';

@Module({
  providers: [CompaniesResolver],
})
export class CompaniesModule {}
