import { UserInputError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Company[]> {
    return this.prisma.company.findMany();
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new UserInputError(`Company #${id} not found`);
    }
    return company;
  }

  async create(
    createCompanyInput: GraphQLTypes.CreateCompanyInput,
  ): Promise<Company> {
    return this.prisma.company.create({
      data: {
        name: createCompanyInput.name,
        companyCode: createCompanyInput.companyCode,
        country: createCompanyInput.country,
        city: createCompanyInput.city,
        address: createCompanyInput.address,
        users: {
          connect: createCompanyInput.users?.map((userId) => ({
            id: userId,
          })),
        },
      },
    });
  }

  async update(
    id: number,
    updateCompanyInput: GraphQLTypes.UpdateCompanyInput,
  ): Promise<Company> {
    const company = this.prisma.company.update({
      where: { id },
      data: {
        name: updateCompanyInput?.name || undefined,
        companyCode: updateCompanyInput?.companyCode || undefined,
        country: updateCompanyInput?.country || undefined,
        city: updateCompanyInput?.city || undefined,
        address: updateCompanyInput?.address || undefined,
        users: {
          connect: updateCompanyInput.users?.map((userId) => ({
            id: userId,
          })),
        },
      },
    });
    if (!company) {
      throw new UserInputError(`Company #${id} not found`);
    }
    return company;
  }

  async remove(id: number): Promise<Company> {
    const company = await this.prisma.company.delete({ where: { id } });
    if (!company) {
      throw new UserInputError(`Company #${id} not found`);
    }
    return company;
  }
}
