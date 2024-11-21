import { UserInputError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { Company, GlobalRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Company[]> {
    return this.prisma.company.findMany();
  }

  async findOne(id: string): Promise<Company> {
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
        orgNumber: createCompanyInput.orgNumber,
        address: createCompanyInput.address,
        postalCode: createCompanyInput.postalCode,
        city: createCompanyInput.city,
        country: createCompanyInput.country,
        companyContactEmail: createCompanyInput.companyContactEmail,

        // not sure about this. want to be able to assign a sandvik admin when a company is created
        userPermission: {
          connect: createCompanyInput.users?.map((userId) => ({
            id: userId,
            userId: userId,
            globalRole: GlobalRole.SANDVIK_ADMIN,
          })),
        },
      },
    });
  }

  async update(
    id: string,
    updateCompanyInput: GraphQLTypes.UpdateCompanyInput,
  ): Promise<Company> {
    const company = this.prisma.company.update({
      where: { id },
      data: {
        name: updateCompanyInput?.name || undefined,
        orgNumber: updateCompanyInput?.orgNumber || undefined,
        address: updateCompanyInput?.address || undefined,
        postalCode: updateCompanyInput?.postalCode || undefined,
        city: updateCompanyInput?.city || undefined,
        country: updateCompanyInput?.country || undefined,
        companyContactEmail:
          updateCompanyInput?.companyContactEmail || undefined,

        // not sure about this
        userPermission: {
          connect: updateCompanyInput.users?.map((userId) => ({
            id: userId,
            userId: userId,
            // want to be able to update userId here, if want to reassign sandvik admin to another
          })),
        },
      },
    });
    if (!company) {
      throw new UserInputError(`Company #${id} not found`);
    }
    return company;
  }

  async remove(id: string): Promise<Company> {
    const company = await this.prisma.company.delete({ where: { id } });
    if (!company) {
      throw new UserInputError(`Company #${id} not found`);
    }
    return company;
  }
}
