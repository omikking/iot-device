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

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new UserInputError(`User #${id} not found`);
    }
    return user;
  }

  async create(createUserInput: GraphQLTypes.CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: createUserInput.email,
        hash: createUserInput.hash,
        role: createUserInput.role,
        fullname: createUserInput.fullname,
        workPlace: createUserInput.workPlace,
        phoneNumber: createUserInput.phoneNumber,
        globalVisibility: createUserInput.globalVisibility,
        companies: {
          connect: createUserInput.companies?.map((companyId) => ({
            id: companyId,
          })),
        },
        plans: {
          connect: createUserInput.plans?.map((planId) => ({
            id: planId,
          })),
        },
        boltResults: {
          connect: createUserInput.boltResults?.map((boltResultId) => ({
            id: boltResultId,
          })),
        },
      },
    });
  }

  async update(
    id: number,
    updateUserInput: GraphQLTypes.UpdateUserInput,
  ): Promise<User> {
    const user = this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserInput?.email || undefined,
        hash: updateUserInput?.hash || undefined,
        role: updateUserInput?.role || undefined,
        fullname: updateUserInput?.fullname || undefined,
        workPlace: updateUserInput?.workPlace || undefined,
        phoneNumber: updateUserInput?.phoneNumber || undefined,
        globalVisibility: updateUserInput?.globalVisibility || undefined,
        companies: {
          connect: updateUserInput.companies?.map((companyId) => ({
            id: companyId,
          })),
        },
        plans: {
          connect: updateUserInput.plans?.map((planId) => ({
            id: planId,
          })),
        },
        boltResults: {
          connect: updateUserInput.boltResults?.map((boltResultId) => ({
            id: boltResultId,
          })),
        },
      },
    });
    if (!user) {
      throw new UserInputError(`User #${id} not found`);
    }
    return user;
  }

  async remove(id: number): Promise<User> {
    const user = await this.prisma.user.delete({ where: { id } });
    if (!user) {
      throw new UserInputError(`User #${id} not found`);
    }
    return user;
  }
}
