import { UserInputError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import {
  Application,
  Company,
  GlobalRole,
  PlanLevel,
  PrismaClient,
  Role,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
const prisma = new PrismaClient();

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    user: ActiveUserData,
    pagination: { offset: number; limit: number },
  ): Promise<GraphQLTypes.CompanyListResponse> {
    const { offset, limit } = pagination;
    const whereCondition: Partial<Record<string, any>> = {};

    if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
      whereCondition.userPermission = {
        some: { userId: user.id },
      };
    }

    const totalRecords = await this.prisma.company.count({
      where: whereCondition,
    });

    const results = await this.prisma.company.findMany({
      where: whereCondition,
      skip: Number(offset),
      take: Number(limit),
    });

    return { totalRecords, results };
  }

  async findOne(
    id: string,
  ): Promise<Company & { sandvikAdminUserId?: string }> {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        userPermission: {
          where: { role: Role.SANDVIK_ADMIN },
          select: { userId: true },
        },
      },
    });

    if (!company) {
      throw new UserInputError(`Company #${id} not found`);
    }

    const sandvikAdminUserId = company.userPermission[0]?.userId;

    return {
      ...company,
      sandvikAdminUserId,
    };
  }

  async create(
    createCompanyInput: GraphQLTypes.CreateCompanyInput,
  ): Promise<Company> {
    const { plans, sandvikAdminUserId, ...companyData } = createCompanyInput;

    const company = await prisma.$transaction(async (prisma) => {
      // Step 1: Validate admin user
      if (!sandvikAdminUserId) {
        throw new UserInputError('sandvikAdminUserId is required');
      }
      const user = await prisma.user.findUnique({
        where: { id: sandvikAdminUserId as string },
        select: { globalRole: true },
      });

      if (!user) {
        throw new UserInputError(`User ${sandvikAdminUserId} does not exist`);
      }

      if (user.globalRole !== Role.SANDVIK_ADMIN) {
        throw new UserInputError(
          `User ${sandvikAdminUserId} does not have global role SANDVIK_ADMIN`,
        );
      }

      // Step 2: Create company with admin userPermission
      const createdCompany = await prisma.company.create({
        data: {
          name: companyData.name,
          orgNumber: companyData.orgNumber,
          address: companyData.address,
          postalCode: companyData.postalCode,
          city: companyData.city,
          country: companyData.country,
          companyContactEmail: companyData.companyContactEmail,
          userPermission: {
            create: {
              user: { connect: { id: sandvikAdminUserId } },
              role: Role.SANDVIK_ADMIN,
              appsAccess: [
                Application.PULL_TEST,
                Application.PULL_TEST_OPERATOR,
                Application.ULTRABOLTS,
                Application.XCYCLOPS,
              ],
            },
          },
        },
      });

      // Step 3: Create plans if provided
      if (plans && plans.length >= 0) {
        await prisma.plan.createMany({
          data: plans.map((plan) => ({
            companyId: createdCompany.id,
            applicationName: plan.applicationName as Application,
            planLevel: plan.planLevel as PlanLevel,
            expiringDate: plan.expiringDate || null,
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
    const { plans, sandvikAdminUserId, ...companyData } = updateCompanyInput;

    const company = await this.prisma.$transaction(async (prisma) => {
      // Step 1: Update basic company info
      const updatedCompany = await prisma.company.update({
        where: { id },
        data: {
          name: companyData?.name || undefined,
          orgNumber: companyData?.orgNumber || undefined,
          address: companyData?.address || undefined,
          postalCode: companyData?.postalCode || undefined,
          city: companyData?.city || undefined,
          country: companyData?.country || undefined,
          companyContactEmail: companyData?.companyContactEmail || undefined,
        },
      });

      // Step 2: Update SANDVIK_ADMIN userPermission
      const existingSandvikAdmins = await prisma.userPermission.findMany({
        where: {
          companyId: id,
          role: Role.SANDVIK_ADMIN,
        },
      });

      const isAlreadyAdmin = existingSandvikAdmins?.some(
        (perm) => perm.userId === sandvikAdminUserId,
      );

      if (!isAlreadyAdmin) {
        // Remove previous SANDVIK_ADMINs for this company
        await prisma.userPermission.deleteMany({
          where: {
            companyId: id,
            role: Role.SANDVIK_ADMIN,
          },
        });

        // Create new SANDVIK_ADMIN
        await prisma.userPermission.create({
          data: {
            companyId: id,
            userId: sandvikAdminUserId as string,
            role: Role.SANDVIK_ADMIN,
            appsAccess: [
              Application.PULL_TEST,
              Application.PULL_TEST_OPERATOR,
              Application.ULTRABOLTS,
              Application.XCYCLOPS,
            ],
          },
        });
      }

      if (plans) {
        // Delete all plans that are not in the request
        const plansToKeepId = plans
          .map((plan) => plan.id)
          .filter((id): id is string => !id !== null && id !== undefined);

        if (plansToKeepId.length > 0) {
          await prisma.plan.deleteMany({
            where: {
              companyId: id,
              NOT: {
                id: { in: plansToKeepId },
              },
            },
          });
        } else {
          // Handle case when no plans are left to keep
          await prisma.plan.deleteMany({
            where: { companyId: id },
          });
        }

        // Update existing plans or create new
        for (const plan of plans) {
          let existingPlan;

          if (plan?.id) {
            existingPlan = await prisma.plan.findUnique({
              where: { id: plan.id },
            });
          }

          if (existingPlan && plan?.id) {
            // Update plan if it already exists
            await prisma.plan.update({
              where: { id: plan.id },
              data: {
                planLevel: plan.planLevel as PlanLevel,
                expiringDate: plan.expiringDate || null,
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
    return this.prisma.company.delete({
      where: { id },
    });
  }
}
