import { Args, Mutation, Query, Resolver, Int, Context } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators';
import { GlobalRole, Role } from '@prisma/client';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import {
  RequireCompanyAccess,
  RequireRoles,
} from 'src/auth/decorators/permission.decorator';
import { CompaniesAccessGuard } from 'src/auth/guard/companies-access.guard';
import { CompanyContextGuard } from 'src/auth/guard/company-context.guard';

@Resolver()
@UseGuards(JwtGuard, CompanyContextGuard, PermissionGuard)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(CompaniesAccessGuard)
  @Query(() => GraphQLTypes.CompanyListResponse, { name: 'companies' })
  async findAll(
    @Context() context: any,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<GraphQLTypes.CompanyListResponse> {
    const pagination = {
      offset: Number(offset ?? 0),
      limit: Number(limit ?? 20),
    };

    return this.companiesService.findAll(
      context.allowedCompanyIds,
      context.isAdmin,
      pagination,
    );
  }

  @RequireCompanyAccess(true)
  @Query('company')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.findOne(id);
  }

  @RequireRoles(GlobalRole.SANDVIK_ADMIN)
  @Mutation('createCompany')
  async create(
    @Args('createCompanyInput')
    createCompanyInput: CreateCompanyInput,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.create(createCompanyInput);
  }

  @RequireCompanyAccess(true)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Mutation('updateCompany')
  async update(
    @ActiveUser() currentUser: ActiveUserData,
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateCompanyInput')
    updateCompanyInput: UpdateCompanyInput,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.update(currentUser, id, updateCompanyInput);
  }

  @RequireCompanyAccess(true)
  @RequireRoles(GlobalRole.SANDVIK_ADMIN, Role.COMPANY_ADMIN)
  @Mutation('removeCompany')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Company> {
    return this.companiesService.remove(id);
  }
}
