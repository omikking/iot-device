import { UserInputError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new UserInputError(`User #${id} not found`);
    }
    return user;
  }

  // This should be the table that adds the user with only email data.
  // The user gets the invitation email, and then finished to SignUp.
  // Maybe we should call this inviteUserInput? Or maybe we should have a separate table for this?
  async create(createUserInput: GraphQLTypes.CreateUserInput): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: createUserInput.email,
        // fullName: createUserInput.fullName,
        // workPlace: createUserInput.workPlace,
        // phoneNumber: createUserInput.phoneNumber,
        // globalRole: createUserInput.globalRole,
        // isGlobalVisibility: createUserInput.isGlobalVisibility,
      },
    });

    if (!createdUser) {
      throw new UserInputError('Failed to create user');
    }
    return createdUser;
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
        globalRole: updateUserInput?.globalRole || undefined,
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
