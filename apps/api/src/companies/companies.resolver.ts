import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';

@Resolver()
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query('companies')
  async findAll(): Promise<GraphQLTypes.Company[]> {
    return this.companiesService.findAll();
  }

  @Query('company')
  // @TODO if we decide to go back using number instead of string for id - ParseIntPipe
  // async findOne(@Args('id', ParseIntPipe) id: string):
  async findOne(@Args('id') id: string): Promise<GraphQLTypes.Company> {
    return this.companiesService.findOne(id);
  }

  @Mutation('createCompany')
  async create(
    @Args('createCompanyInput')
    createCompanyInput: CreateCompanyInput,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.create(createCompanyInput);
  }

  @Mutation('updateCompany')
  async update(
    @Args('id') id: string,
    @Args('updateCompanyInput')
    updateCompanyInput: UpdateCompanyInput,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.update(id, updateCompanyInput);
  }

  @Mutation('removeCompany')
  async remove(@Args('id') id: string): Promise<GraphQLTypes.Company> {
    return this.companiesService.remove(id);
  }
}
