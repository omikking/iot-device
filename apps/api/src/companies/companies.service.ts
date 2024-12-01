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
            expiringDate: plan.expiringDate || null,
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
    const { plans, userPermissions, ...companyData } = updateCompanyInput;

    const company = await this.prisma.$transaction(async (prisma) => {
      const updatedCompany = await prisma.company.update({
        where: { id },
        data: {
          name: companyData?.name || undefined,
          orgNumber: companyData?.orgNumber || undefined,
          adress: companyData?.adress || undefined,
          postalCode: companyData?.postalCode || undefined,
          city: companyData?.city || undefined,
          country: companyData?.country || undefined,
          companyContactEmail: companyData?.companyContactEmail || undefined,

          userPermission: {
            updateMany: userPermissions?.map((userPermissionInput) => ({
              where: {
                companyId: id,
                userId: userPermissionInput?.oldUserId,
              },
              data: {
                userId: userPermissionInput?.newUserId || undefined,
              },
            })),
          },
        },
      });

      if (plans && plans.length > 0) {
        // Delete plans that are not listed in the request
        const plansToKeepId = plans.map((plan) => plan.id);
        await prisma.plan.deleteMany({
          where: {
            companyId: id,
            NOT: {
              id: { in: plansToKeepId },
            },
          },
        });

        // Update existing plans or create new
        for (const plan of plans) {
          const existingPlan = await prisma.plan.findUnique({
            where: { id: plan.id },
          });

          if (existingPlan) {
            // Update plan if it already exists
            await prisma.plan.update({
              where: { id: plan.id },
              data: {
                planLevel: plan.planLevel as PlanLevel,
                expiringDate: plan.expiringDate || undefined,
              },
            });
          } else {
            // Create new plan if new one was added
            await prisma.plan.create({
              data: {
                companyId: updatedCompany.id,
                applicationName: plan.applicationName as Application,
                planLevel: plan.planLevel as PlanLevel,
                expiringDate: plan.expiringDate || null,
              },
            });
          }
        }
      }

      return updatedCompany;
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
