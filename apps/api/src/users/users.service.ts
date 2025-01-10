import { UserInputError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GlobalRole, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';

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
      throw new UserInputError(`User #${id} not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserInput: GraphQLTypes.UpdateUserInput,
  ): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserInput?.email || undefined,
        fullName: updateUserInput?.fullName || undefined,
        workPlace: updateUserInput?.workPlace || undefined,
        phoneNumber: updateUserInput?.phoneNumber || undefined,
        globalRole: (updateUserInput?.globalRole as GlobalRole) || undefined,
        isGlobalVisibility: updateUserInput?.isGlobalVisibility || undefined,
      },
    });

    if (!updatedUser) {
      throw new UserInputError(`User #${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const user = await this.prisma.user.delete({ where: { id } });
    if (!user) {
      throw new UserInputError(`User #${id} not found`);
    }
    return user;
  }
}
