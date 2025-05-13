import { Injectable } from '@nestjs/common';
import { Application, Role, UserPermission } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';

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
      throw new UserInputError(`UserPermission #${id} not found`);
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
      throw new UserInputError(
        `User with email ${createUserPermissionInput.userEmail} will be invited to setup account, wont work now, tbd later...`,
      );
    }

    const existingUserPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId: user?.id,
        companyId: createUserPermissionInput.companyId,
      },
    });

    if (existingUserPermission) {
      throw new UserInputError(
        `User already has permissions for this company. Please edit existing permissions instead.`,
      );
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
      throw new UserInputError('Failed to create userPermission');
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
      throw new UserInputError(`UserPermission #${id} not found`);
    }
    return updatedUserPermission;
  }

  async remove(id: string): Promise<UserPermission> {
    const userPermission = await this.prisma.userPermission.delete({
      where: { id },
    });
    if (!userPermission) {
      throw new UserInputError(`UserPermission #${id} not found`);
    }
    return userPermission;
  }
}
