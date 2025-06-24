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
    const { plans, userPermissions, ...companyData } = createCompanyInput;

    const company = await prisma.$transaction(async (prisma) => {
      const createdCompany = await prisma.company.create({
        data: {
          ...companyData,
          userPermission: {
            create: await Promise.all(
              userPermissions?.map(async (userPermission) => {
                const user = await prisma.user.findUnique({
                  where: { id: userPermission.userId },
                  select: { globalRole: true },
                });

                if (!user) {
                  throw new UserInputError(
                    `User ${userPermission.userId} does not exist`,
                  );
                }

                if (user.globalRole !== Role.SANDVIK_ADMIN) {
                  throw new UserInputError(
                    `User ${userPermission.userId} does not have global role as SANDVIK_ADMIN`,
                  );
                }

                return {
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
                };
              }),
            ),
          },
        },
      });

      if (plans?.length) {
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
    const { plans, userPermissions, ...companyData } = updateCompanyInput;

    // Convert nulls to undefined to match Prisma types
    const sanitizedData = Object.fromEntries(
      Object.entries(companyData).map(([key, value]) => [
        key,
        value ?? undefined,
      ]),
    );

    const company = await this.prisma.$transaction(async (prisma) => {
      const updatedCompany = await prisma.company.update({
        where: { id },
        data: {
          ...sanitizedData,
          ...(userPermissions
            ? {
                userPermission: {
                  updateMany: userPermissions.map((userPermissionInput) => ({
                    where: {
                      companyId: id,
                      userId: userPermissionInput.oldUserId,
                    },
                    data: {
                      userId: userPermissionInput.newUserId || undefined,
                    },
                  })),
                },
              }
            : {}),
        },
      });

      // 🛠 Handle Plans
      if (plans) {
        const plansToKeepId = plans
          .map((plan) => plan.id)
          .filter((id): id is string => !!id);

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
          await prisma.plan.deleteMany({ where: { companyId: id } });
        }

        for (const plan of plans) {
          const existingPlan = plan?.id
            ? await prisma.plan.findUnique({ where: { id: plan.id } })
            : null;

          if (existingPlan && plan.id) {
            await prisma.plan.update({
              where: { id: plan.id },
              data: {
                planLevel: plan.planLevel as PlanLevel,
                expiringDate: plan.expiringDate || null,
              },
            });
          } else {
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
