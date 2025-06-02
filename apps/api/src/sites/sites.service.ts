import { Injectable } from '@nestjs/common';
import { Site } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Site[]> {
    return this.prisma.site.findMany();
  }

  async findOne(id: string): Promise<Site> {
    const site = await this.prisma.site.findUnique({ where: { id } });
    if (!site) {
      throw new UserInputError(`Site #${id} not found`);
    }
    return site;
  }

  async create(createSiteInput: GraphQLTypes.CreateSiteInput): Promise<Site> {
    const createdSite = await this.prisma.site.create({
      data: {
        siteName: createSiteInput.siteName,
        address: createSiteInput.address,
        postalCode: createSiteInput.postalCode,
        city: createSiteInput.city,
        country: createSiteInput.country,
        companyId: createSiteInput.companyId,
      },
    });

    if (!createdSite) {
      throw new UserInputError('Failed to create site');
    }
    return createdSite;
  }

  async update(
    id: string,
    updateSiteInput: GraphQLTypes.UpdateSiteInput,
  ): Promise<Site> {
    const updatedSite = await this.prisma.site.update({
      where: { id, companyId: updateSiteInput.companyId },

      data: {
        siteName: updateSiteInput?.siteName || undefined,
        address: updateSiteInput?.address || undefined,
        postalCode: updateSiteInput?.postalCode || undefined,
        city: updateSiteInput?.city || undefined,
        country: updateSiteInput?.country || undefined,
      },
    });

    if (!updatedSite) {
      throw new UserInputError(`Site #${id} not found`);
    }
    return updatedSite;
  }

  async remove(id: string): Promise<Site> {
    return this.prisma.site.delete({
      where: { id },
    });
  }
}
