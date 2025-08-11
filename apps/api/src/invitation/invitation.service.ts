import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { Application, Role } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitationService {
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
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { name: true },
    });

    if (existingUser) {
      // If user exists, just add permission for the company
      await this.prisma.userPermission.create({
        data: {
          userId: existingUser.id,
          companyId,
          role,
          appsAccess,
        },
      });

      // We could send a notification email here if desired
      return { userId: existingUser.id, isNewUser: false };
    }

    // Create invitation record
    const invitation = await this.prisma.invitation.create({
      data: {
        email,
        token,
        expiresAt,
        companyId,
        role,
        appsAccess,
      },
    });

    // Send email invitation
    await this.emailService.sendInvitationEmail(email, token, company.name);

    return { invitationId: invitation.id, isNewUser: true };
  }

  async validateInvitation(token: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: { company: true },
    });

    if (!invitation) {
      return { valid: false, reason: 'invalid_token' };
    }

    if (invitation.used) {
      return { valid: false, reason: 'already_used' };
    }

    if (invitation.expiresAt < new Date()) {
      return { valid: false, reason: 'expired' };
    }

    return { valid: true, invitation };
  }

  async completeInvitation(
    token: string,
    userData: {
      fullName: string;
      password: string;
      workPlace: string;
      phoneNumber?: string;
    },
  ) {
    const validation = await this.validateInvitation(token);

    if (!validation.valid) {
      throw new Error(`Invalid invitation: ${validation.reason}`);
    }

    const invitation = validation.invitation;

    const hash = await this.hashPassword(userData.password);

    // Create user in transaction
    const { user } = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: invitation.email,
          hash,
          fullName: userData.fullName,
          workPlace: userData.workPlace,
          phoneNumber: userData.phoneNumber,
        },
      });

      await tx.userPermission.create({
        data: {
          userId: user.id,
          companyId: invitation.companyId,
          role: invitation.role,
          appsAccess: invitation.appsAccess,
        },
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { used: true },
      });

      return { user };
    });

    return user;
  }

  // TODO: Temp update to authservice
  private async hashPassword(password: string): Promise<string> {
    return password;
  }
}
