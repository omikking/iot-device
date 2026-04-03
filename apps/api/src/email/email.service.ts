import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalRole, Role } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { EmailTemplateService } from './email-template.service';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import {EmailSesService} from './email.ses-service';

@Injectable()
export class EmailService {
  private transporter;

  constructor(
    private configService: ConfigService,
    private emailTemplateService: EmailTemplateService,
    private emailSesService : EmailSesService
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  // ================================================================================
  // PUBLIC EMAIL SENDING METHODS
  // ================================================================================

  // 1: For non-existing user invitations on company level
  async sendInvitationEmail(
    email: string,
    invitationId: string,
    token: string,
    companyName: string,
    userRole?: string,
  ) {
    const inviteUrl = `${this.configService.get('FRONTEND_URL')}/setup-account?id=${invitationId}&token=${token}`;

    const htmlTemplate = this.emailTemplateService.buildInvitationTemplate(
      inviteUrl,
      companyName,
      userRole,
    );

    const roleText = this.emailTemplateService.getRoleDisplayText(userRole);

    const textContent = `
      Ground Support Platform

      SANDVIK

      Welcome to ${companyName}

      You have been invited to join ${companyName} in Ground Support Platform ${roleText}.

      Accept this invitation and setup your account: ${inviteUrl}

      This invitation link will expire in 48 hours.

      Need help? Contact your administrator for assistance.
    `.trim();

    const subject = `You're invited to join ${companyName} as ${this.emailTemplateService.getRoleDisplayName(userRole)}`;

    const provider = this.configService.get('EMAIL_PROVIDER') || 'smtp';

    if (provider === 'ses') {
      await this.emailSesService.sendEmail(
        email,
        subject,
        textContent,
        htmlTemplate,
      );
    } else {
      await this.transporter.sendMail({
        from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
        to: email,
        subject,
        text: textContent,
        html: htmlTemplate,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
        },
      });
    }
    // await this.transporter.sendMail({
    //   from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
    //   to: email,
    //   subject: `You're invited to join ${companyName} as ${this.emailTemplateService.getRoleDisplayName(userRole)}`,
    //   text: textContent,
    //   html: htmlTemplate,
    //   headers: {
    //     'X-Priority': '1',
    //     'X-MSMail-Priority': 'High',
    //   },
    // });
  }

  // 2: For non-existing user receiving global role invitation
  async sendGlobalInvitationEmail(
    email: string,
    invitationId: string,
    token: string,
    globalRole: GlobalRole,
  ) {
    const inviteUrl = `${this.configService.get('FRONTEND_URL')}/setup-account?id=${invitationId}&token=${token}`;

    const roleDisplayName =
      globalRole === GlobalRole.SANDVIK_ADMIN
        ? 'Sandvik Administrator'
        : 'Sandvik Technician';

    const htmlTemplate =
      this.emailTemplateService.buildGlobalInvitationTemplate(
        inviteUrl,
        roleDisplayName,
      );

    const textContent = `
      Ground Support Platform

      SANDVIK

      You have been invited to join Ground Support Platform as a ${roleDisplayName}

      Global Access Granted
      ${
        globalRole === GlobalRole.SANDVIK_ADMIN
          ? 'This role provides platform-wide access across all companies and workspaces with enhanced administrative capabilities.'
          : 'This role provides specialized technical access across all companies and workspaces with support capabilities.'
      }

      Accept this invitation and setup your account: ${inviteUrl}

      This invitation link will expire in 48 hours.

      Need help? Contact your administrator for assistance.

      Note: This invitation was sent by a Sandvik Administrator.
    `.trim();

    const subject = `You're invited to join Ground Support Platform as ${roleDisplayName}`;

    const provider = this.configService.get('EMAIL_PROVIDER') || 'smtp';

    if (provider === 'ses') {
      await this.emailSesService.sendEmail(
        email,
        subject,
        textContent,
        htmlTemplate,
      );
    } else {
      await this.transporter.sendMail({
        from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
        to: email,
        subject,
        text: textContent,
        html: htmlTemplate,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
        },
      });
    }
    // await this.transporter.sendMail({
    //   from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
    //   to: email,
    //   subject: `You're invited to join Ground Support Platform as ${roleDisplayName}`,
    //   text: textContent,
    //   html: htmlTemplate,
    //   headers: {
    //     'X-Priority': '1',
    //     'X-MSMail-Priority': 'High',
    //   },
    // });
  }

  // 3: For existing user invitations on company level
  async sendExistingUserEmail(
    email: string,
    userRole: Role,
    companyName: string,
  ) {
    const roleDisplayName =
      userRole === Role.COMPANY_ADMIN
        ? 'Administrator'
        : userRole === Role.SANDVIK_TECHNICIAN
          ? 'Sandvik Technician'
          : 'Contributor';

    const loginUrl = `${this.configService.get('FRONTEND_URL')}/api/auth/signin`;

    const roleText = this.emailTemplateService.getRoleDisplayText(userRole);

    const htmlTemplate =
      this.emailTemplateService.buildExistingUserNotificationTemplate(
        roleDisplayName,
        companyName,
      );

    const textContent = `
      Ground Support Platform

      SANDVIK

      You have been assigned to join ${companyName} in Ground Support Platform ${roleText}.

      Sign in to Ground Support Platform: ${loginUrl}

      Need help? Contact your administrator for assistance.
    `.trim();

    const subject = `You have been assigned as ${roleDisplayName} for ${companyName} in Ground Support Platform`;

    const provider = this.configService.get('EMAIL_PROVIDER') || 'smtp';

    if (provider === 'ses') {
      await this.emailSesService.sendEmail(
        email,
        subject,
        textContent,
        htmlTemplate,
      );
    } else {
      await this.transporter.sendMail({
        from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
        to: email,
        subject,
        text: textContent,
        html: htmlTemplate,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
        },
      });
    }

    // await this.transporter.sendMail({
    //   from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
    //   to: email,
    //   subject: `You have been assigned as ${roleDisplayName} for ${companyName} in Ground Support Platform`,
    //   text: textContent,
    //   html: htmlTemplate,
    //   headers: {
    //     'X-Priority': '2',
    //     'X-MSMail-Priority': 'Normal',
    //   },
    // });
  }

  // 4: For existing user receiving global role invitation
  async sendExistingGlobalUserEmail(email: string, globalRole: GlobalRole) {
    const roleDisplayName =
      globalRole === GlobalRole.SANDVIK_ADMIN
        ? 'Sandvik Administrator'
        : 'Sandvik Technician';

    const loginUrl = `${this.configService.get('FRONTEND_URL')}/api/auth/signin`;

    const htmlTemplate =
      this.emailTemplateService.buildExistingGlobalUserNotificationTemplate(
        roleDisplayName,
      );

    const textContent = `
      Ground Support Platform

      SANDVIK

      You have been assigned as ${roleDisplayName} in Ground Support Platform.

      You've been granted global ${roleDisplayName.toLowerCase()} privileges.

      Sign in to Ground Support Platform: ${loginUrl}

      Need help? Contact your administrator for assistance.

      Note: This invitation was sent by a Sandvik Administrator.
    `.trim();

    const subject = `You have been assigned as ${roleDisplayName} in Ground Support Platform`;

    const provider = this.configService.get('EMAIL_PROVIDER') || 'smtp';

    if (provider === 'ses') {
      await this.emailSesService.sendEmail(
        email,
        subject,
        textContent,
        htmlTemplate,
      );
    } else {
      await this.transporter.sendMail({
        from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
        to: email,
        subject,
        text: textContent,
        html: htmlTemplate,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
        },
      });
    }
    // await this.transporter.sendMail({
    //   from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
    //   to: email,
    //   subject: `You have been assigned as ${roleDisplayName} in Ground Support Platform`,
    //   text: textContent,
    //   html: htmlTemplate,
    //   headers: {
    //     'X-Priority': '2',
    //     'X-MSMail-Priority': 'Normal',
    //   },
    // });
  }

  // 5: Password reset with OTP
  async sendOneTimePassword(email: string, otp: string): Promise<void> {
    const htmlTemplate =
      this.emailTemplateService.buildPasswordResetTemplate(otp);

    const textContent = `
      Ground Support Platform

      SANDVIK

      Password Reset Request

      You have requested to reset your password. Use the verification code below to proceed with your password reset.

      Your verification code: ${otp}

      This code will expire in 30 minutes.

      If you did not request this password reset, please ignore this email or contact your administrator.

      Need help? Contact your administrator for assistance.
    `.trim();

    const subject = `Password Reset - Ground Support Platform`;

    const provider = this.configService.get('EMAIL_PROVIDER') || 'smtp';

    if (provider === 'ses') {
      await this.emailSesService.sendEmail(
        email,
        subject,
        textContent,
        htmlTemplate,
      );
    } else {
      await this.transporter.sendMail({
        from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
        to: email,
        subject,
        text: textContent,
        html: htmlTemplate,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
        },
      });
    }
    // await this.transporter.sendMail({
    //   from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
    //   to: email,
    //   subject: 'Password Reset - Ground Support Platform',
    //   text: textContent,
    //   html: htmlTemplate,
    //   headers: {
    //     'X-Priority': '1',
    //     'X-MSMail-Priority': 'High',
    //   },
    // });
  }
}
