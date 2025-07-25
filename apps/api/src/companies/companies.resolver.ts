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
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { getAllowedCompanyIds } from 'src/utils/resolveAllowedCompanyIds';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
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

    const allowedCompanyIds = getAllowedCompanyIds(user);
    return this.companiesService.findAll(user, pagination, allowedCompanyIds);
  }

  @Roles([], [], 'company')
  @Query('company')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.findOne(id);
  }

  @Roles([Role.SANDVIK_ADMIN], [], 'company')
  @Mutation('createCompany')
  async create(
    @Args('createCompanyInput')
    createCompanyInput: CreateCompanyInput,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.create(createCompanyInput);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'company')
  @Mutation('updateCompany')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateCompanyInput')
    @ActiveUser()
    user: ActiveUserData,
    updateCompanyInput: UpdateCompanyInput,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.update(id, updateCompanyInput, user);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'company')
  @Mutation('removeCompany')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.remove(id);
  }
}
