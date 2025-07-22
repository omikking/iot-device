import { ForbiddenError, UserInputError } from '@nestjs/apollo';
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
import { errorTexts } from 'src/errorTexts/errorTexts';
const prisma = new PrismaClient();

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    allowedCompanyIds: string[] | null,
    isSandvikAdmin: boolean,
    pagination: { offset: number; limit: number },
  ): Promise<GraphQLTypes.CompanyListResponse> {
    const { offset, limit } = pagination;
    let whereCondition: Partial<Record<string, any>> = {};

    if (!isSandvikAdmin) {
      if (!allowedCompanyIds || allowedCompanyIds.length === 0) {
        throw new ForbiddenError(errorTexts.permissionsDenied);
      }
      whereCondition = { id: { in: allowedCompanyIds } };
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
      throw new UserInputError('', {
        extensions: {
          code: 'COMPANY_NOTFOUND_ERROR',
          title: errorTexts.companyNotFound_title(id),
        },
      });
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
    try {
      const { plans, sandvikAdminUserId, ...companyData } = createCompanyInput;

      // Validations
      const company = await prisma.$transaction(async (prisma) => {
        if (!sandvikAdminUserId) {
          throw new UserInputError('', {
            extensions: {
              code: 'COMPANY_ADMINREQUIRED_ERROR',
              title: errorTexts.companyAdminRequired_title,
            },
          });
        }

        const existingCompany = await prisma.company.findFirst({
          where: {
            OR: [
              { name: companyData.name },
              { orgNumber: companyData.orgNumber },
            ],
          },
        });

        if (existingCompany) {
          throw new UserInputError('', {
            extensions: {
              code: 'COMPANY_ALREADYEXISTS_INFO',
              title: errorTexts.companyAlreadyExists_title,
              message: errorTexts.companyAlreadyExists_message,
              type: 'info',
            },
          });
        }

        const user = await prisma.user.findUnique({
          where: { id: sandvikAdminUserId as string },
          select: { globalRole: true },
        });

        if (!user) {
          throw new UserInputError('', {
            extensions: {
              code: 'COMPANY_ADMINNOTFOUND_ERROR',
              title: errorTexts.companyAdminNotFound_title,
            },
          });
        }

        if (user.globalRole !== Role.SANDVIK_ADMIN) {
          throw new UserInputError('', {
            extensions: {
              code: 'COMPANY_USERNOTADMIN_ERROR',
              title: errorTexts.companyUserNotAdmin_title,
            },
          });
        }

        // Create company with admin userPermission
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
                  Application.BANSHEE,
                ],
              },
            },
          },
        });

        // Create plans if provided
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
        throw new UserInputError('', {
          extensions: {
            code: 'COMPANY_CREATE_ERROR',
            title: errorTexts.companyCreateError_title,
          },
        });
      }

      return company;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'COMPANY_CREATE_ERROR_GENERIC',
          title: errorTexts.companyCreateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async update(
    currentUser: ActiveUserData,
    id: string,
    updateCompanyInput: GraphQLTypes.UpdateCompanyInput,
  ): Promise<Company> {
    // TODO need to separate this logic into multiple functions for clarity
    try {
      const { plans, sandvikAdminUserId, ...companyData } = updateCompanyInput;

      const isSandvikAdmin =
        currentUser.globalRole === GlobalRole.SANDVIK_ADMIN;

      // Update basic company info
      const company = await this.prisma.$transaction(async (prisma) => {
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

        // ONLY SANDVIK ADMIN - Update sandvik admin assignment
        if (isSandvikAdmin && sandvikAdminUserId) {
          const existingSandvikAdmins = await prisma.userPermission.findMany({
            where: {
              companyId: id,
              role: Role.SANDVIK_ADMIN,
            },
          });

          const isAlreadyAdmin = existingSandvikAdmins?.some(
            (perm) => perm.userId === sandvikAdminUserId,
          );

          // Remove previous SANDVIK_ADMINs for this company
          if (!isAlreadyAdmin) {
            const newAdmin = await prisma.user.findUnique({
              where: { id: sandvikAdminUserId as string },
              select: { globalRole: true },
            });

            if (newAdmin?.globalRole !== GlobalRole.SANDVIK_ADMIN) {
              throw new UserInputError('', {
                extensions: {
                  code: 'COMPANY_USERNOTADMIN_ERROR',
                  title: errorTexts.companyUserNotAdmin_title,
                },
              });
            }

            await prisma.userPermission.deleteMany({
              where: {
                companyId: id,
                role: Role.SANDVIK_ADMIN,
              },
            });

            // Create new SANDVIK_ADMIN permission
            await prisma.userPermission.create({
              data: {
                companyId: id,
                userId: sandvikAdminUserId as string,
                role: Role.SANDVIK_ADMIN,
                appsAccess: [
                  Application.PULL_TEST,
                  Application.PULL_TEST_OPERATOR,
                  Application.BANSHEE,
                ],
              },
            });
          }
        }

        // ONLY SANDVIK ADMIN - Delete all plans that are not in the request
        if (isSandvikAdmin) {
          if (plans) {
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
        }

        return updatedCompany;
      });

      if (!company) {
        throw new UserInputError('', {
          extensions: {
            code: 'COMPANY_CREATE_ERROR',
            title: errorTexts.companyNotFound_title(id),
          },
        });
      }

      return company;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'COMPANY_UPDATE_ERROR_GENERIC',
          title: errorTexts.companyUpdateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async remove(id: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new UserInputError('', {
        extensions: {
          code: 'COMPANY_NOTFOUND_ERROR',
          title: errorTexts.companyNotFound_title(id),
        },
      });
    }

    try {
      return await this.prisma.company.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'COMPANY_DELETE_ERROR_GENERIC',
          title: errorTexts.companyDeleteError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }
}
