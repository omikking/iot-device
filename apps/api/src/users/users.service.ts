import { UserInputError } from '@nestjs/apollo';
import * as argon from 'argon2';
import { Injectable } from '@nestjs/common';
import { GlobalRole, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    user: ActiveUserData,
    allowedCompanyIds: string[],
    roles?: GlobalRole[],
  ): Promise<User[]> {
    // If roles are provided, only the users with the provided roles will be returned
    const where: Prisma.UserWhereInput = {
      isDeleted: false, // Only return non-deleted users
    };

    if (user.globalRole === GlobalRole.SANDVIK_ADMIN) {
      if (roles && roles.length > 0) {
        where.globalRole = { in: roles };
      }
      return this.prisma.user.findMany({ where });
    }

    // Check if requesting SANDVIK_TECHNICIAN with global visibility
    const isRequestingGlobalTechnicians =
      roles?.includes(GlobalRole.SANDVIK_TECHNICIAN) && roles.length === 1;

    if (isRequestingGlobalTechnicians) {
      // Return global visibility technicians with limited fields for all users
      return this.prisma.user.findMany({
        where: {
          globalRole: GlobalRole.SANDVIK_TECHNICIAN,
          isGlobalVisibility: true,
          isDeleted: false, // Only return non-deleted users
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          email: true,
          fullName: true,
          workPlace: true,
        },
      }) as Promise<User[]>;
    }

    // Original logic for company-based access
    where.userRole = {
      some: {
        companyId: { in: allowedCompanyIds },
      },
    };

    if (roles && roles.length > 0) {
      where.globalRole = { in: roles };
    }
    return this.prisma.user.findMany({
      where,
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        isDeleted: false, // Only return non-deleted users
      },
    });
    if (!user) {
      throw new UserInputError('', {
        extensions: {
          code: 'USER_NOTFOUND_ERROR',
          title: errorTexts.userNotFound_title(id),
        },
      });
    }
    return user;
  }

  async update(
    id: string,
    updateUserInput: GraphQLTypes.UpdateUserInput,
    updatePasswordInput?: GraphQLTypes.UpdatePasswordInput,
  ): Promise<User> {
    let hashedPassword: string | undefined = undefined;

    const { oldPassword, newPassword, confirmPassword } =
      updatePasswordInput || {};

    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword || !newPassword || !confirmPassword) {
        throw new UserInputError('', {
          extensions: {
            code: 'USER_PASSWORD_FIELDS_REQUIRED_ERROR',
            title: errorTexts.userPasswordFieldsRequired_title,
          },
        });
      }

      const existingUser = await this.prisma.user.findFirst({
        where: {
          id,
          isDeleted: false, // Only allow updating non-deleted users
        },
      });
      if (!existingUser) {
        throw new UserInputError('', {
          extensions: {
            code: 'USER_NOTFOUND_ERROR',
            title: errorTexts.userNotFound_title(id),
          },
        });
      }

      const isOldPasswordValid = await argon.verify(
        existingUser.hash,
        oldPassword,
      );

      if (!isOldPasswordValid) {
        throw new UserInputError('', {
          extensions: {
            code: 'USER_INCORRECT_PASSWORD_ERROR',
            title: errorTexts.userIncorrectPassword_title,
            message: errorTexts.userIncorrectPassword_message,
          },
        });
      }

      if (newPassword !== confirmPassword) {
        throw new UserInputError('', {
          extensions: {
            code: 'USER_PASSWORD_MISMATCH_ERROR',
            title: errorTexts.userPasswordMismatch_title,
            message: errorTexts.userPasswordMismatch_message,
          },
        });
      }

      hashedPassword = await argon.hash(newPassword);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          email: updateUserInput?.email || undefined,
          fullName: updateUserInput?.fullName || undefined,
          workPlace: updateUserInput?.workPlace || undefined,
          phoneNumber: updateUserInput?.phoneNumber || undefined,
          globalRole: (updateUserInput?.globalRole as GlobalRole) || undefined,
          isGlobalVisibility: updateUserInput?.isGlobalVisibility ?? undefined,
          ...(hashedPassword && { hash: hashedPassword }),
        },
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'USER_UPDATE_ERROR',
          title: errorTexts.userUpdateError_title,
        },
      });
    }
  }

  async remove(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        isDeleted: false, // Only allow soft delete of non-deleted users
      },
    });

    if (!user) {
      throw new UserInputError('', {
        extensions: {
          code: 'USER_NOTFOUND_ERROR',
          title: errorTexts.userNotFound_title(id),
        },
      });
    }

    if (user.isDeleted) {
      throw new UserInputError('', {
        extensions: {
          code: 'USER_ALREADY_DELETED_ERROR',
          title: 'User is already deleted',
        },
      });
    }

    try {
      // Perform soft delete by setting isDeleted to true
      return await this.prisma.user.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'USER_DELETE_ERROR',
          title: errorTexts.userDeleteError_title,
        },
      });
    }
  }
}
