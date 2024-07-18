import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as GraphQLTypes from 'src/graphql-types';
import { CompaniesService } from './companies.service';
import { ParseIntPipe } from '@nestjs/common';

@Resolver()
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query('companies')
  async findAll(): Promise<GraphQLTypes.Company[]> {
    return this.companiesService.findAll();
  }

  @Query('company')
  async findOne(
    @Args('id', ParseIntPipe) id: number,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.findOne(id);
  }

  @Mutation('createCompany')
  async create(
    @Args('createCompanyInput')
    createCompanyInput: GraphQLTypes.CreateCompanyInput,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.create(createCompanyInput);
  }

  @Mutation('updateCompany')
  async update(
    @Args('id', ParseIntPipe) id: number,
    @Args('updateCompanyInput')
    updateCompanyInput: GraphQLTypes.UpdateCompanyInput,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.update(id, updateCompanyInput);
  }

  @Mutation('removeCompany')
  async remove(
    @Args('id', ParseIntPipe) id: number,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.remove(id);
  }
}
