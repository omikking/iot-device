import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CompanyListResponse } from './companyListResponse';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators';
import { ConfigService } from '@nestjs/config';

@Resolver()
@UseGuards(JwtGuard)
export class CompaniesResolver {
  constructor(
    private readonly config: ConfigService,
    private readonly companiesService: CompaniesService,
  ) {}

  @Query(() => CompanyListResponse, { name: 'companies' })
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ): Promise<CompanyListResponse> {
    const finalSkip = Number(
      skip ?? this.config.get<number>('DEFAULT_SKIP') ?? 0,
    );
    const finalTake = Number(
      take ?? this.config.get<number>('DEFAULT_TAKE') ?? 20,
    );
    return this.companiesService.findAll(user, userId, finalSkip, finalTake);
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
