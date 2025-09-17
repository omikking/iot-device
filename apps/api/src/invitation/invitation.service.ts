import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { Application, GlobalRole, Role } from '@prisma/client';
import { randomBytes } from 'crypto';
import * as argon from 'argon2';
import { errorTexts } from '../errorTexts/errorTexts';
import { isPasswordStrong } from '../utils';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class InvitationService {
  // Rate limiting: max 3 invitations per email per hour
  private readonly RATE_LIMIT_MAX_INVITATIONS = 3;
  private readonly RATE_LIMIT_WINDOW_HOURS = 1;

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async createInvitation(
    email: string,
    companyId: string,
    role: Role,
    appsAccess: Application[],
  ) {
    // Check if company exists
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { name: true },
    });

    if (!company) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_COMPANY_NOT_FOUND_ERROR',
          title: errorTexts.invitationCompanyNotFound_title,
          message: errorTexts.invitationCompanyNotFound_message,
        },
      });
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Check if user already has permissions for this company
      const existingPermission = await this.prisma.userPermission.findFirst({
        where: {
          userId: existingUser.id,
          companyId,
        },
      });

      if (existingPermission) {
        // User already has access to this company, send a notification/reminder
        try {
          await this.emailService.sendInvitationReminderEmail(
            email,
            '', // No invitation ID since they're already registered
            '', // No token needed since they're already registered
            company.name,
            role,
          );

          return {
            userId: existingUser.id,
            isNewUser: false,
            message: 'User already has access. Notification sent.',
          };
        } catch (emailError) {
          // If email fails, still return success but note the email issue
          return {
            userId: existingUser.id,
            isNewUser: false,
            message: 'User already has access. Failed to send notification.',
          };
        }
      }

      // Add permission for the existing user
      try {
        await this.prisma.userPermission.create({
          data: {
            userId: existingUser.id,
            companyId,
            role,
            appsAccess,
          },
        });

        return { userId: existingUser.id, isNewUser: false };
      } catch (error) {
        throw new UserInputError('', {
          extensions: {
            code: 'INVITATION_CREATE_ERROR',
            title: errorTexts.invitationCreateError_title,
            message: errorTexts.contactSupportError,
          },
        });
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: {
        email,
        companyId,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      // Instead of throwing an error, resend the existing invitation
      await this.resendInvitation(existingInvitation.id);
      return {
        invitationId: existingInvitation.id,
        isNewUser: false, // Indicating this is a resent invitation
      };
    }

    // Rate limiting check
    await this.checkRateLimit(email);

    // Generate secure token and hash it
    const token = randomBytes(32).toString('hex');
    const tokenHash = await argon.hash(token);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    try {
      // Create invitation record with hashed token
      const invitation = await this.prisma.invitation.create({
        data: {
          email,
          token: tokenHash,
          expiresAt,
          companyId,
          role,
          appsAccess,
        },
      });

      // Send email invitation with id and plain token
      await this.emailService.sendInvitationEmail(
        email,
        invitation.id,
        token,
        company.name,
        role,
      );

      return {
        invitationId: invitation.id,
        isNewUser: true,
      };
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_CREATE_ERROR',
          title: errorTexts.invitationCreateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async createGlobalInvitation(
    email: string,
    globalRole: GlobalRole,
    isGlobalVisibility: boolean,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      try {
        // Update existing user's global role
        await this.prisma.user.update({
          where: { id: existingUser.id },
          data: { globalRole, isGlobalVisibility },
        });

        await this.emailService.sendExistingGlobalUserNotificationEmail(
          email,
          globalRole,
        );

        return { userId: existingUser.id, isNewUser: false };
      } catch (error) {
        throw new UserInputError('', {
          extensions: {
            code: 'INVITATION_CREATE_ERROR',
            title: errorTexts.invitationCreateError_title,
            message: errorTexts.contactSupportError,
          },
        });
      }
    }

    // Check for existing pending global invitation
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: {
        email,
        globalRole: { not: null },
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_DUPLICATE_ERROR',
          title: errorTexts.invitationDuplicate_title,
          message: errorTexts.invitationDuplicate_message,
        },
      });
    }

    // Rate limiting check
    await this.checkRateLimit(email);

    // Generate secure token and hash it
    const token = randomBytes(32).toString('hex');
    const tokenHash = await argon.hash(token);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    try {
      // Create invitation record with hashed token
      const invitation = await this.prisma.invitation.create({
        data: {
          email,
          token: tokenHash,
          expiresAt,
          globalRole,
          isGlobalVisibility,
        },
      });

      // Send global role invitation email with plain token
      await this.emailService.sendGlobalInvitationEmail(
        email,
        invitation.id,
        token,
        globalRole,
      );

      return {
        invitationId: invitation.id,
        isNewUser: true,
      };
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_CREATE_ERROR',
          title: errorTexts.invitationCreateError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async validateInvitation(id: string, token: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!invitation) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_INVALID_TOKEN_ERROR',
          title: errorTexts.invitationInvalidToken_title,
          message: errorTexts.invitationInvalidToken_message,
        },
      });
    }

    try {
      const isValidToken = await argon.verify(invitation.token, token);
      if (!isValidToken) {
        throw new UserInputError('', {
          extensions: {
            code: 'INVITATION_INVALID_TOKEN_ERROR',
            title: errorTexts.invitationInvalidToken_title,
            message: errorTexts.invitationInvalidToken_message,
          },
        });
      }
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_INVALID_TOKEN_ERROR',
          title: errorTexts.invitationInvalidToken_title,
          message: errorTexts.invitationInvalidToken_message,
        },
      });
    }

    if (invitation.used) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_ALREADY_USED_ERROR',
          title: errorTexts.invitationAlreadyUsed_title,
          message: errorTexts.invitationAlreadyUsed_message,
        },
      });
    }

    if (invitation.expiresAt < new Date()) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_EXPIRED_ERROR',
          title: errorTexts.invitationExpired_title,
          message: errorTexts.invitationExpired_message,
        },
      });
    }

    if (invitation.expiresAt < new Date()) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_EXPIRED_ERROR',
          title: errorTexts.invitationExpired_title,
          message: errorTexts.invitationExpired_message,
        },
      });
    }

    return { valid: true, invitation };
  }

  async completeInvitation(
    id: string,
    token: string,
    userData: {
      fullName: string;
      password: string;
      workPlace: string;
      phoneNumber?: string;
    },
  ) {
    // Validate password strength
    if (!isPasswordStrong(userData.password)) {
      throw new UserInputError('', {
        extensions: {
          code: 'USER_PASSWORD_TOO_WEAK_ERROR',
          title: errorTexts.userPasswordTooWeak_title,
          message: errorTexts.userPasswordTooWeak_message,
        },
      });
    }

    const { invitation } = await this.validateInvitation(id, token);

    if (!invitation) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_NOT_FOUND_ERROR',
          title: errorTexts.invitationInvalidToken_title,
          message: errorTexts.invitationInvalidToken_message,
        },
      });
    }

    const hash = await argon.hash(userData.password);

    try {
      // Create user in transaction with proper error handling
      const result = await this.prisma.$transaction(
        async (tx) => {
          const user = await tx.user.create({
            data: {
              email: invitation.email,
              hash,
              fullName: userData.fullName,
              workPlace: userData.workPlace,
              phoneNumber: userData.phoneNumber,
              // Set global role if this is a global invitation
              globalRole: invitation.globalRole || undefined,
            },
          });

          // Create company permission if this is a company invitation
          if (invitation.companyId && invitation.role) {
            await tx.userPermission.create({
              data: {
                userId: user.id,
                companyId: invitation.companyId,
                role: invitation.role,
                appsAccess: invitation.appsAccess,
              },
            });
          }

          await tx.invitation.update({
            where: { id: invitation.id },
            data: { used: true },
          });

          return user;
        },
        {
          timeout: 10000, // 10 second timeout
        },
      );

      return result;
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_COMPLETE_ERROR',
          title: errorTexts.invitationCompleteError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async getPendingInvitations(companyId: string) {
    try {
      const invitations = await this.prisma.invitation.findMany({
        where: {
          companyId,
          used: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Transform to PendingInvitation format (without token)
      return invitations.map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
        used: invitation.used,
        companyId: invitation.companyId,
        globalRole: null, // Company invitations don't have global roles
        role: invitation.role,
      }));
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_FETCH_ERROR',
          title: 'Failed to fetch invitations',
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async getPendingGlobalInvitations() {
    try {
      const invitations = await this.prisma.invitation.findMany({
        where: {
          globalRole: { not: null }, // Global invitations have a globalRole
          used: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Transform to PendingInvitation format (without token)
      return invitations.map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
        used: invitation.used,
        companyId: null,
        globalRole: invitation.globalRole,
        role: invitation.globalRole,
        isGlobalVisibility: invitation.isGlobalVisibility,
      }));
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_FETCH_ERROR',
          title: 'Failed to fetch invitations',
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async resendInvitation(id: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!invitation) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_NOT_FOUND_ERROR',
          title: errorTexts.invitationNotFound_title(id),
          message: errorTexts.contactSupportError,
        },
      });
    }

    if (invitation.used) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_ALREADY_USED_ERROR',
          title: errorTexts.invitationAlreadyUsed_title,
          message: errorTexts.invitationAlreadyUsed_message,
        },
      });
    }

    // Rate limiting check
    await this.checkRateLimit(invitation.email);

    // Generate new token and hash
    const newToken = randomBytes(32).toString('hex');
    const newTokenHash = await argon.hash(newToken);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    try {
      const updatedInvitation = await this.prisma.invitation.update({
        where: { id },
        data: {
          token: newTokenHash,
          expiresAt,
        },
      });

      // Send appropriate email based on invitation type with plain token
      if (invitation.globalRole) {
        // Global role invitation
        await this.emailService.sendGlobalInvitationEmail(
          invitation.email,
          invitation.id,
          newToken,
          invitation.globalRole,
        );
      } else if (invitation.company) {
        // Company invitation
        await this.emailService.sendInvitationEmail(
          invitation.email,
          invitation.id,
          newToken,
          invitation.company.name,
          invitation.role || undefined, // Pass the role for role-specific email content
        );
      } else {
        throw new UserInputError('', {
          extensions: {
            code: 'INVITATION_INVALID_TYPE_ERROR',
            title: 'Invalid invitation type',
            message: errorTexts.contactSupportError,
          },
        });
      }

      return updatedInvitation;
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_RESEND_ERROR',
          title: errorTexts.invitationResendError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  async removeInvitation(id: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_NOT_FOUND_ERROR',
          title: errorTexts.invitationNotFound_title(id),
          message: errorTexts.contactSupportError,
        },
      });
    }

    if (invitation.used) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_ALREADY_USED_ERROR',
          title: 'Cannot remove used invitation',
          message: 'Cannot remove invitation that has already been used',
        },
      });
    }

    try {
      const deletedInvitation = await this.prisma.invitation.delete({
        where: { id },
      });

      return deletedInvitation;
    } catch (error) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_REMOVE_ERROR',
          title: errorTexts.invitationRemoveError_title,
          message: errorTexts.contactSupportError,
        },
      });
    }
  }

  private async checkRateLimit(email: string) {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - this.RATE_LIMIT_WINDOW_HOURS);

    const recentInvitations = await this.prisma.invitation.count({
      where: {
        email,
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    if (recentInvitations >= this.RATE_LIMIT_MAX_INVITATIONS) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_RATE_LIMIT_ERROR',
          title: errorTexts.invitationRateLimit_title,
          message: errorTexts.invitationRateLimit_message,
        },
      });
    }
  }
}
