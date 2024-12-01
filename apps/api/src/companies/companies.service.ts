import { UserInputError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import {
  Application,
  Company,
  PlanLevel,
  PrismaClient,
  Role,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';

const prisma = new PrismaClient();

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
    const { plans, ...companyData } = createCompanyInput;

    // @TODO Need to make a check to make sure the connected user has the Sandvik Admin role
    const company = await prisma.$transaction(async (prisma) => {
      const createdCompany = await prisma.company.create({
        data: {
          name: companyData.name,
          orgNumber: companyData.orgNumber,
          adress: companyData.adress,
          postalCode: companyData.postalCode,
          city: companyData.city,
          country: companyData.country,
          companyContactEmail: companyData.companyContactEmail,

          userPermission: {
            create: companyData.userPermissions?.map((userPermission) => ({
              user: {
                connect: {
                  id: userPermission.userId,
                },
              },
              role: Role.SANDVIK_ADMIN,
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

      if (plans && plans.length > 0) {
        console.log(plans);

        await prisma.plan.createMany({
          data: plans.map((plan) => ({
            companyId: createdCompany.id,
            // Should we type Application and PlanLevel here really?
            applicationName: plan.applicationName as Application,
            planLevel: plan.planLevel as PlanLevel,
            expiringDate: plan.expiringDate,
            // expiringDate: plan.expiringDate
            //   ? new Date(plan.expiringDate).toISOString()
            //   : null,
          })),
        });
      }

      return createdCompany;
    });

    if (!company) {
      throw new UserInputError('Failed to create the company and plans');
    }
    return company;
  }

  async update(
    id: string,
    updateCompanyInput: GraphQLTypes.UpdateCompanyInput,
  ): Promise<Company> {
    const company = await this.prisma.company.update({
      where: { id },
      data: {
        name: updateCompanyInput?.name || undefined,
        orgNumber: updateCompanyInput?.orgNumber || undefined,
        adress: updateCompanyInput?.adress || undefined,
        postalCode: updateCompanyInput?.postalCode || undefined,
        city: updateCompanyInput?.city || undefined,
        country: updateCompanyInput?.country || undefined,
        companyContactEmail:
          updateCompanyInput?.companyContactEmail || undefined,

        userPermission: {
          updateMany: updateCompanyInput.userPermissions?.map(
            (userPermissionInput) => ({
              where: {
                companyId: id,
                userId: userPermissionInput?.oldUserId,
              },
              data: {
                userId: userPermissionInput?.newUserId || undefined,
              },
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
