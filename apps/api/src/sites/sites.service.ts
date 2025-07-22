import { Injectable } from '@nestjs/common';
import { Site } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenError, UserInputError } from '@nestjs/apollo';
import * as GraphQLTypes from 'src/graphql-types';
import { errorTexts } from 'src/errorTexts/errorTexts';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    allowedCompanyIds: string[] | null,
    isSandvikAdmin: boolean,
  ): Promise<Site[]> {
    // Return all sites for Sandvik Admins, or filter by company access for users
    if (isSandvikAdmin) {
      return this.prisma.site.findMany();
    }
    if (!allowedCompanyIds || allowedCompanyIds.length === 0) {
      throw new ForbiddenError(errorTexts.permissionsDenied);
    }
    return this.prisma.site.findMany({
      where: { companyId: { in: allowedCompanyIds } },
    });
  }

  async findOne(id: string): Promise<Site> {
    const site = await this.prisma.site.findUnique({ where: { id } });
    if (!site) {
      throw new UserInputError('', {
        extensions: {
          code: 'SITE_NOTFOUND_ERROR',
          title: errorTexts.siteNotFound_title(id),
        },
      });
    }
    return site;
  }

  async create(createSiteInput: GraphQLTypes.CreateSiteInput): Promise<Site> {
    try {
      const siteName = createSiteInput.siteName.trim();

      await this.checkSiteNameExists(createSiteInput.siteName);

      const createdSite = await this.prisma.site.create({
        data: {
          siteName,
          address: createSiteInput.address,
          postalCode: createSiteInput.postalCode,
          city: createSiteInput.city,
          country: createSiteInput.country,
          companyId: createSiteInput.companyId,
        },
      });

      if (!createdSite) {
        throw new UserInputError('', {
          extensions: {
            code: 'SITE_CREATE_ERROR',
            title: errorTexts.siteCreateError_title,
          },
        });
      }

      return createdSite;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'SITE_CREATE_ERROR_GENERIC',
          title: errorTexts.siteCreateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async update(
    id: string,
    updateSiteInput: GraphQLTypes.UpdateSiteInput,
  ): Promise<Site> {
    try {
      const site = await this.prisma.site.findUnique({
        where: {
          id,
          companyId: updateSiteInput.companyId,
        },
      });

      if (!site) {
        throw new UserInputError('', {
          extensions: {
            code: 'SITE_NOTFOUND_ERROR',
            title: errorTexts.siteNotFound_title(id),
          },
        });
      }

      if (
        updateSiteInput.siteName &&
        updateSiteInput.siteName !== site.siteName
      ) {
        await this.checkSiteNameExists(updateSiteInput.siteName);
      }

      return this.prisma.site.update({
        where: { id, companyId: updateSiteInput.companyId },
        data: {
          siteName: updateSiteInput?.siteName || undefined,
          address: updateSiteInput?.address || undefined,
          postalCode: updateSiteInput?.postalCode || undefined,
          city: updateSiteInput?.city || undefined,
          country: updateSiteInput?.country || undefined,
        },
      });
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'SITE_UPDATE_ERROR_GENERIC',
          title: errorTexts.siteUpdateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async remove(id: string): Promise<Site> {
    const site = await this.prisma.site.findUnique({
      where: { id },
    });

    if (!site) {
      throw new UserInputError('', {
        extensions: {
          code: 'SITE_NOTFOUND_ERROR',
          title: errorTexts.siteNotFound_title(id),
        },
      });
    }

    try {
      return await this.prisma.site.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new UserInputError('', {
        extensions: {
          code: 'SITE_DELETE_ERROR',
          title: errorTexts.siteDeleteError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  // Check if a site with the same name already exists
  private async checkSiteNameExists(siteName: string): Promise<Site | null> {
    const trimmedName = siteName.trim();

    const whereCondition: any = { siteName: trimmedName };

    const existingSite = await this.prisma.site.findFirst({
      where: whereCondition,
    });

    if (existingSite) {
      console.log('existingSite');
      throw new UserInputError('', {
        extensions: {
          code: 'SITE_ALREADYEXISTS_INFO',
          title: errorTexts.siteAlreadyExists_title,
          type: 'info',
        },
      });
    }

    return existingSite;
  }
}
