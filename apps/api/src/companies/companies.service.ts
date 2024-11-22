import { UserInputError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { Application, Company, CompanyRole, GlobalRole } from '@prisma/client';
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

        userPermission: {
          create: createCompanyInput.userPermissions?.map((userPermission) => ({
            user: {
              connect: {
                id: userPermission.userId,
              },
            },
            // userId: userPermission.userId, // no need?
            globalRole: GlobalRole.SANDVIK_ADMIN, // Update to be optional
            companyRole: CompanyRole.COMPANY_ADMIN, // Update to be optional
            appsAccess: [
              Application.PULL_TEST,
              Application.PULL_TEST_OPERATOR,
              Application.ULTRABOLTS,
              Application.XCYCLOPS,
            ],
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

        // WIP
        userPermission: {
          connect: updateCompanyInput.userPermissions?.map(
            (userPermissionId) => ({
              id: userPermissionId, // ?
              userId: userPermissionId,
              // want to be able to update userId here, if want to reassign sandvik admin to another
            }),
          ),
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
