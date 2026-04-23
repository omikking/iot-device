import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BansheeTemplateInputDto } from './dto/banshee-template.input';
import { Application, GlobalRole, Template } from '@prisma/client';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { UserInputError } from '@nestjs/apollo/dist/errors/user-input.error';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { hasAppAccessForCompany } from 'src/utils';

@Injectable()
export class BansheeTemplateService {
  private readonly logger = new Logger(BansheeTemplateService.name);

  constructor(private prisma: PrismaService) {}

  async createBansheeTemplate(
    createBansheeTemplateInput: BansheeTemplateInputDto,
    user: ActiveUserData,
  ): Promise<Template> {
    try {
      if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
        try {
          await this.validateUserCompanyAccess(
            user,
            createBansheeTemplateInput.companyId,
          );
        } catch {
          throw new ForbiddenException(
            'User does not have access to this banshee template.',
          );
        }
      }
      const existingTemplate = await this.prisma.template.findFirst({
        where: {
          templateName: createBansheeTemplateInput.templateName,
          companyId: createBansheeTemplateInput.companyId,
        },
      });
      if (existingTemplate) {
        throw new UserInputError('', {
          extensions: {
            code: 'BANSHEE_TEMPLATE_DUPLICATE_TEMPLATE_NAME',
            title: `A banshee template with template name ${createBansheeTemplateInput.templateName} already exists`,
          },
        });
      }

      await this.validateRelations(
        createBansheeTemplateInput.levelId,
        createBansheeTemplateInput.driveId,
        createBansheeTemplateInput.locationId,
      );

      const createdBansheeTemplate = await this.prisma.template.create({
        data: {
          templateName: createBansheeTemplateInput.templateName,
          period: createBansheeTemplateInput.period,
          boltInstallationDateTime:
            createBansheeTemplateInput.boltInstallationDateTime,
          siteId: createBansheeTemplateInput.siteId,
          levelId: createBansheeTemplateInput.levelId,
          driveId: createBansheeTemplateInput.driveId,
          locationId: createBansheeTemplateInput.locationId,
          locationDetails:
            createBansheeTemplateInput.locationDetails || undefined,
          coordinates: createBansheeTemplateInput.coordinates || undefined,
          activateNotifications:
            createBansheeTemplateInput.activateNotifications,
          comment: createBansheeTemplateInput.comment,
          companyId: createBansheeTemplateInput.companyId,
          ringPosition: createBansheeTemplateInput.ringPosition,
          createdBy: user.id,
          updatedBy: user.id,
        },
      });

      return { ...createdBansheeTemplate };
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      this.logger.error(
        'Error creating banshee template',
        error instanceof Error ? error.stack : String(error),
      );
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_TEMPLATE_CREATION_ERROR_GENERIC',
          title: errorTexts.bansheeTemplateCreateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async updateBansheeTemplate(
    id: string,
    updateBansheeTemplateInput: BansheeTemplateInputDto,
    user: ActiveUserData,
  ): Promise<Template> {
    try {
      if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
        try {
          await this.validateUserCompanyAccess(
            user,
            updateBansheeTemplateInput.companyId,
          );
        } catch {
          throw new ForbiddenException(
            'User does not have access to this banshee template.',
          );
        }
      }
      const existingTemplate = await this.prisma.template.findUnique({
        where: { id },
      });

      if (!existingTemplate) {
        throw new UserInputError('', {
          extensions: {
            code: 'BANSHEE_TEMPLATE_NOTFOUND_ERROR',
            title: `Banshee template #${id} not found`,
          },
        });
      }

      const existingTemplateByName = await this.prisma.template.findFirst({
        where: {
          templateName: updateBansheeTemplateInput.templateName,
          companyId: updateBansheeTemplateInput.companyId,
        },
      });
      if (existingTemplateByName && existingTemplateByName.id !== id) {
        throw new UserInputError('', {
          extensions: {
            code: 'BANSHEE_TEMPLATE_DUPLICATE_TEMPLATE_NAME',
            title: `A banshee template with template name ${updateBansheeTemplateInput.templateName} already exists`,
          },
        });
      }

      if (
        updateBansheeTemplateInput.levelId ||
        updateBansheeTemplateInput.driveId ||
        updateBansheeTemplateInput.locationId
      ) {
        await this.validateRelations(
          updateBansheeTemplateInput.levelId ||
            existingTemplate.levelId ||
            undefined,
          updateBansheeTemplateInput.driveId ||
            existingTemplate.driveId ||
            undefined,
          updateBansheeTemplateInput.locationId ||
            existingTemplate.locationId ||
            undefined,
        );
      }

      const updatedTemplate = await this.prisma.template.update({
        where: { id },
        data: {
          templateName: updateBansheeTemplateInput.templateName,
          period: updateBansheeTemplateInput.period,
          boltInstallationDateTime:
            updateBansheeTemplateInput.boltInstallationDateTime,
          siteId: updateBansheeTemplateInput.siteId || undefined,
          levelId: updateBansheeTemplateInput.levelId || undefined,
          driveId: updateBansheeTemplateInput.driveId || undefined,
          locationId: updateBansheeTemplateInput.locationId || undefined,
          locationDetails:
            updateBansheeTemplateInput.locationDetails || undefined,
          coordinates: updateBansheeTemplateInput.coordinates || undefined,
          activateNotifications:
            updateBansheeTemplateInput.activateNotifications,
          comment: updateBansheeTemplateInput.comment,
          ringPosition: updateBansheeTemplateInput.ringPosition || undefined,
          updatedBy: user.id,
          updatedAt: new Date(),
        },
      });

      return { ...updatedTemplate };
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      this.logger.error(
        `Error updating banshee template #${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_TEMPLATE_UPDATE_ERROR_GENERIC',
          title: errorTexts.bansheeTemplateUpdateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async deleteBansheeTemplate(
    id: string,
    user: ActiveUserData,
  ): Promise<Template> {
    const existingTemplate = await this.prisma.template.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_TEMPLATE_NOTFOUND_ERROR',
          title: `Banshee template #${id} not found`,
        },
      });
    }

    if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
      try {
        await this.validateUserCompanyAccess(user, existingTemplate.companyId);
      } catch {
        throw new ForbiddenException(
          'User does not have access to this banshee template.',
        );
      }
    }

    try {
      const deletedTemplate = await this.prisma.template.delete({
        where: { id },
      });

      return { ...deletedTemplate };
    } catch (error) {
      this.logger.error(
        `Error deleting banshee template #${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_TEMPLATE_DELETE_ERROR_GENERIC',
          title: errorTexts.bansheeTemplateDeleteError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async findBansheeTemplateById(
    id: string,
    user: ActiveUserData,
  ): Promise<Template> {
    try {
      const template = await this.prisma.template.findUnique({
        where: { id },
      });

      if (!template) {
        throw new UserInputError('', {
          extensions: {
            code: 'BANSHEE_TEMPLATE_NOTFOUND_ERROR',
            title: `Banshee template #${id} not found`,
          },
        });
      }

      if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
        try {
          await this.validateUserCompanyAccess(user, template.companyId);
        } catch {
          throw new ForbiddenException(
            'User does not have access to this banshee template.',
          );
        }
      }

      return { ...template };
    } catch (error) {
      if (
        error instanceof UserInputError ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(
        `Error fetching banshee template #${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_TEMPLATE_FETCH_ERROR',
          title: errorTexts.bansheeTemplateFetchError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async findBansheeTemplates(
    companyId: string,
    user: ActiveUserData,
  ): Promise<Template[]> {
    try {
      const hasAccess = await hasAppAccessForCompany(
        this.prisma,
        user,
        [Application.BANSHEE],
        companyId,
      );

      if (!hasAccess) {
        throw new ForbiddenException(
          'User missing access to this application for this company.',
        );
      }

      const templates = await this.prisma.template.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });

      return templates;
    } catch (error) {
      if (
        error instanceof UserInputError ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(
        'Error fetching banshee templates',
        error instanceof Error ? error.stack : String(error),
      );
      throw new UserInputError('', {
        extensions: {
          code: 'BANSHEE_TEMPLATES_FETCH_ERROR',
          title: errorTexts.bansheeTemplateFetchError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  private async validateUserCompanyAccess(
    user: ActiveUserData,
    companyId: string,
  ): Promise<void> {
    const userPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId: user.id,
        companyId,
      },
    });

    if (!userPermission) {
      throw new UserInputError('', {
        extensions: {
          code: 'USER_COMPANY_ACCESS_DENIED',
          title: 'User does not have access to the specified company',
        },
      });
    }
  }

  private async validateRelations(
    levelId?: string,
    driveId?: string,
    locationId?: string,
  ): Promise<void> {
    if (levelId) {
      const level = await this.prisma.level.findUnique({
        where: { id: levelId },
      });
      if (!level) {
        throw new UserInputError('', {
          extensions: {
            code: 'LEVEL_NOTFOUND_ERROR',
            title: errorTexts.levelNotFound_title(levelId),
          },
        });
      }
    }

    if (driveId) {
      const drive = await this.prisma.drive.findUnique({
        where: { id: driveId },
        include: { level: true },
      });
      if (!drive) {
        throw new UserInputError('', {
          extensions: {
            code: 'DRIVE_NOTFOUND_ERROR',
            title: errorTexts.driveNotFound_title(driveId),
          },
        });
      }

      if (levelId && drive.levelId !== levelId) {
        throw new UserInputError('', {
          extensions: {
            code: 'DRIVE_LEVEL_MISMATCH_ERROR',
            title: 'Drive does not belong to the specified level',
            message:
              'The specified drive does not belong to the specified level.',
          },
        });
      }
    }

    if (locationId) {
      const location = await this.prisma.location.findUnique({
        where: { id: locationId },
        include: { drive: true },
      });
      if (!location) {
        throw new UserInputError('', {
          extensions: {
            code: 'LOCATION_NOTFOUND_ERROR',
            title: errorTexts.locationNotFound_title(locationId),
          },
        });
      }

      if (driveId && location.driveId !== driveId) {
        throw new UserInputError('', {
          extensions: {
            code: 'LOCATION_DRIVE_MISMATCH_ERROR',
            title: 'Location does not belong to the specified drive',
            message:
              'The specified location does not belong to the specified drive.',
          },
        });
      }
    }
  }
}
