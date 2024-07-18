import { Query, Resolver } from '@nestjs/graphql';
import * as GraphQLTypes from 'src/graphql-types';

@Resolver()
export class CompaniesResolver {
  @Query('companies')
  async findAll(): Promise<GraphQLTypes.Company[]> {
    return this.companiesService.findAll();
  }
}
