import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles-decorator';

//TODO :- update this role decorator according to requirement this is for testing

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
@Roles('COMPANY_USER', 'SADVIK_TECHNICIAN')
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query(() => GraphQLTypes.CompanyListResponse, { name: 'companies' })
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<GraphQLTypes.CompanyListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return this.companiesService.findAll(user, pagination);
  }

  @Query('company')
  // @TODO if we decide to go back using number instead of string for id change to ParseIntPipe
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Company> {
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
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateCompanyInput')
    updateCompanyInput: UpdateCompanyInput,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.update(id, updateCompanyInput);
  }

  @Mutation('removeCompany')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.remove(id);
  }
}
