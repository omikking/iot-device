import { BoltResultInputError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { BoltResult } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class BoltResultsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<BoltResult[]> {
    return this.prisma.boltResult.findMany();
  }

  async findOne(id: number): Promise<BoltResult> {
    const boltResult = await this.prisma.boltResult.findUnique({
      where: { id },
    });
    if (!boltResult) {
      throw new BoltResultInputError(`BoltResult #${id} not found`);
    }
    return boltResult;
  }

  async create(
    createBoltResultInput: GraphQLTypes.CreateBoltResultInput,
  ): Promise<BoltResult> {
    return this.prisma.boltResult.create({
      data: {
        name: createBoltResultInput.name,
        orgNumber: createBoltResultInput.orgNumber,
        address: createBoltResultInput.address,
        postalCode: createBoltResultInput.postalCode,
        city: createBoltResultInput.city,
        country: createBoltResultInput.country,
        companyContactEmail: createBoltResultInput.companyContactEmail,
        users: {
          connect: createBoltResultInput.users?.map((userId) => ({
            id: userId,
          })),
        },
        plans: {
          connect: createBoltResultInput.plans?.map((planId) => ({
            id: planId,
          })),
        },
        sites: {
          connect: createBoltResultInput.sites?.map((siteId) => ({
            id: siteId,
          })),
        },
      },
    });
  }

  async update(
    id: number,
    updateBoltResultInput: GraphQLTypes.UpdateBoltResultInput,
  ): Promise<BoltResult> {
    const boltResult = this.prisma.boltResult.update({
      where: { id },
      data: {
        name: updateBoltResultInput?.name || undefined,
        orgNumber: updateBoltResultInput?.orgNumber || undefined,
        address: updateBoltResultInput?.address || undefined,
        postalCode: updateBoltResultInput?.postalCode || undefined,
        city: updateBoltResultInput?.city || undefined,
        country: updateBoltResultInput?.country || undefined,
        users: {
          connect: updateBoltResultInput.users?.map((userId) => ({
            id: userId,
          })),
        },
        plans: {
          connect: updateBoltResultInput.plans?.map((planId) => ({
            id: planId,
          })),
        },
        sites: {
          connect: updateBoltResultInput.sites?.map((siteId) => ({
            id: siteId,
          })),
        },
      },
    });
    if (!boltResult) {
      throw new BoltResultInputError(`BoltResult #${id} not found`);
    }
    return boltResult;
  }

  async remove(id: number): Promise<BoltResult> {
    const boltResult = await this.prisma.boltResult.delete({ where: { id } });
    if (!boltResult) {
      throw new BoltResultInputError(`BoltResult #${id} not found`);
    }
    return boltResult;
  }
}
