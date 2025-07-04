import { Injectable } from '@nestjs/common';
import { Application, Role, UserPermission } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';

@Injectable()
export class UserPermissionsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<UserPermission[]> {
    return this.prisma.userPermission.findMany();
  }

  async findOne(id: string): Promise<UserPermission> {
    const userPermission = await this.prisma.userPermission.findUnique({
      where: { id },
    });
    if (!userPermission) {
      throw new UserInputError('', {
        extensions: {
          code: 'USERPERMISSION_NOTFOUND_ERROR',
          title: errorTexts.userPermissionNotFound_title(id),
        },
      });
    }
    return userPermission;
  }

  async create(
    createUserPermissionInput: GraphQLTypes.CreateUserPermissionInput,
  ): Promise<UserPermission> {
    const user = await this.prisma.user.findUnique({
      where: { email: createUserPermissionInput.userEmail },
    });

    if (!user) {
      throw new UserInputError('', {
        extensions: {
          code: 'USER_NOTFOUND_ERROR',
          title: errorTexts.userNotFoundByEmail_title,
          message: errorTexts.userNotFoundByEmail_message(
            createUserPermissionInput.userEmail,
          ),
        },
      });
    }

    const existingUserPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId: user?.id,
        companyId: createUserPermissionInput.companyId,
      },
    });

    if (existingUserPermission) {
      throw new UserInputError('', {
        extensions: {
          code: 'USERPERMISSION_ALREADYEXISTS_INFO',
          title: errorTexts.userPermissionAlreadyExists_title,
          message: errorTexts.userPermissionAlreadyExists_message,
          type: 'info',
        },
      });
    }

    const createdUserPermission = await this.prisma.userPermission.create({
      data: {
        userId: user.id,
        role: createUserPermissionInput.role as Role,
        appsAccess: createUserPermissionInput.appsAccess as Application[],
        companyId: createUserPermissionInput.companyId,
      },
    });

    if (!createdUserPermission) {
      throw new UserInputError('', {
        extensions: {
          code: 'USERPERMISSION_CREATE_ERROR',
          title: errorTexts.userPermissionCreateError_title,
        },
      });
    }
    return createdUserPermission;
  }

  async update(
    id: string,
    updateUserPermissionInput: GraphQLTypes.UpdateUserPermissionInput,
  ): Promise<UserPermission> {
    const updatedUserPermission = await this.prisma.userPermission.update({
      where: { id },

      data: {
        role: (updateUserPermissionInput?.role as Role) || undefined,
        appsAccess:
          (updateUserPermissionInput?.appsAccess as Application[]) || undefined,
      },
    });

    if (!updatedUserPermission) {
      throw new UserInputError('', {
        extensions: {
          code: 'USERPERMISSION_NOTFOUND_ERROR',
          title: errorTexts.userPermissionNotFound_title(id),
        },
      });
    }
    return updatedUserPermission;
  }

  async remove(id: string): Promise<UserPermission> {
    const userPermission = await this.prisma.userPermission.findUnique({
      where: { id },
    });

    if (!userPermission) {
      throw new UserInputError('', {
        extensions: {
          code: 'USERPERMISSION_NOTFOUND_ERROR',
          title: errorTexts.userPermissionNotFound_title(id),
        },
      });
    }

    try {
      return await this.prisma.userPermission.delete({
        where: { id },
      });
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'USERPERMISSION_DELETE_ERROR',
          title: errorTexts.userPermissionDeleteError_title,
        },
      });
    }
  }
}
