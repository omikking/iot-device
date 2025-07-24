import { UserInputError } from '@nestjs/apollo';
import * as argon from 'argon2';
import { Injectable } from '@nestjs/common';
import { GlobalRole, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { isPasswordStrong } from 'src/utils/utils';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll(roles?: GlobalRole[]): Promise<User[]> {
    // If roles are provided, only the users with the provided roles will be returned
    const where: Prisma.UserWhereInput = {};

    if (roles && roles.length > 0) {
      where.globalRole = { in: roles };
    }
    return this.prisma.user.findMany({
      where,
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
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

      const existingUser = await this.prisma.user.findUnique({ where: { id } });
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

      if (!isPasswordStrong(newPassword)) {
        throw new UserInputError('', {
          extensions: {
            code: 'USER_PASSWORD_TOO_WEAK_ERROR',
            title: errorTexts.userPasswordTooWeak_title,
            message: errorTexts.userPasswordTooWeak_message,
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
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new UserInputError('', {
        extensions: {
          code: 'USER_NOTFOUND_ERROR',
          title: errorTexts.userNotFound_title(id),
        },
      });
    }

    try {
      return await this.prisma.user.delete({ where: { id } });
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
