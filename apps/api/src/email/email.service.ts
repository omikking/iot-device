import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalRole } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class EmailService {
  private transporter;

  constructor(
    private configService: ConfigService,
    private emailTemplateService: EmailTemplateService,
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

  async sendInvitationEmail(
    email: string,
    invitationId: string,
    token: string,
    companyName: string,
    userRole?: string,
  ) {
    const inviteUrl = `${this.configService.get('FRONTEND_URL')}/setup-account?id=${invitationId}&token=${token}`;

    const htmlTemplate = this.emailTemplateService.generateInvitationTemplate(
      inviteUrl,
      companyName,
      userRole,
    );

    const roleText = this.emailTemplateService.getRoleDisplayText(userRole);
    const textContent = `
      You're Invited to Ground Support Platform!

      Welcome to ${companyName}

      You have been invited to join ${companyName} on the Ground Support Platform${roleText}.

      Accept your invitation: ${inviteUrl}

      This invitation link will expire in 48 hours for security purposes.

      Need help? Contact your team administrator for assistance.
    `.trim();

    const subjectText = userRole
      ? `You're invited to join ${companyName} as ${this.emailTemplateService.getRoleDisplayName(userRole)}`
      : `Invitation to join ${companyName} on Ground Support Platform`;

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: subjectText,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
      },
    });
  }

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
      this.emailTemplateService.generateGlobalInvitationTemplate(
        inviteUrl,
        roleDisplayName,
      );

    const textContent = `
      Global Access Invitation - Ground Support Platform

      SANDVIK
      You have been granted a ${roleDisplayName} role

      Global Access Granted
      ${
        globalRole === GlobalRole.SANDVIK_ADMIN
          ? 'This role provides platform-wide access across all companies and workspaces with enhanced administrative capabilities.'
          : 'This role provides specialized technical access across all companies and workspaces with support capabilities.'
      }

      Accept your global role invitation: ${inviteUrl}

      Time-sensitive invitation
      This invitation link will expire in 48 hours for security purposes.

      Note: This invitation was sent by a Sandvik Administrator.
      ${
        globalRole === GlobalRole.SANDVIK_ADMIN
          ? 'This invitation grants elevated privileges across the entire Ground Support Platform.'
          : 'This invitation grants specialized technical access across the entire Ground Support Platform.'
      }
    `.trim();

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: `You have been invited as ${roleDisplayName} to Ground Support Platform`,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
      },
    });
  }

  async sendRoleBasedInvitationEmail(
    email: string,
    invitationId: string,
    token: string,
    scenario: 'company-admin' | 'company-user' | 'technician' | 'global-admin',
    companyName?: string,
  ) {
    const inviteUrl = `${this.configService.get('FRONTEND_URL')}/setup-account?id=${invitationId}&token=${token}`;

    let subject: string;
    let htmlTemplate: string;
    let textContent: string;

    switch (scenario) {
      case 'company-admin':
        subject = `You're invited to join ${companyName} as an administrator`;
        htmlTemplate = this.emailTemplateService.generateInvitationTemplate(
          inviteUrl,
          companyName!,
          'COMPANY_ADMIN',
        );
        textContent = this.emailTemplateService.generateTextContent(
          inviteUrl,
          companyName!,
          'COMPANY_ADMIN',
        );
        break;

      case 'company-user':
        subject = `You're invited to join ${companyName}`;
        htmlTemplate = this.emailTemplateService.generateInvitationTemplate(
          inviteUrl,
          companyName!,
          'COMPANY_USER',
        );
        textContent = this.emailTemplateService.generateTextContent(
          inviteUrl,
          companyName!,
          'COMPANY_USER',
        );
        break;

      case 'technician':
        subject = `You're invited to join Ground Support Platform as a technician`;
        htmlTemplate =
          this.emailTemplateService.generateGlobalInvitationTemplate(
            inviteUrl,
            'Sandvik Technician',
          );
        textContent = this.emailTemplateService.generateGlobalTextContent(
          inviteUrl,
          'Sandvik Technician',
        );
        break;

      case 'global-admin':
        subject = `You're invited to join Ground Support Platform as an administrator`;
        htmlTemplate =
          this.emailTemplateService.generateGlobalInvitationTemplate(
            inviteUrl,
            'Sandvik Administrator',
          );
        textContent = this.emailTemplateService.generateGlobalTextContent(
          inviteUrl,
          'Sandvik Administrator',
        );
        break;

      default:
        throw new Error(`Unknown invitation scenario: ${scenario}`);
    }

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

  async sendInvitationReminderEmail(
    email: string,
    invitationId: string,
    token: string,
    companyName: string,
    userRole?: string,
  ) {
    // If no invitationId, this is a notification for existing users
    if (!invitationId) {
      return this.sendExistingUserNotificationEmail(
        email,
        companyName,
        userRole,
      );
    }

    const inviteUrl = `${this.configService.get('FRONTEND_URL')}/setup-account?id=${invitationId}&token=${token}`;

    const htmlTemplate = this.emailTemplateService.generateInvitationTemplate(
      inviteUrl,
      companyName,
      userRole,
    );

    const roleText = this.emailTemplateService.getRoleDisplayText(userRole);
    const textContent = `
      Reminder: Your invitation to Ground Support Platform is still pending

      ${companyName}

      This is a friendly reminder that you have been invited to join ${companyName} on the Ground Support Platform${roleText}.

      You haven't completed your account setup yet. Please click the link below to accept your invitation:

      Accept your invitation: ${inviteUrl}

      This invitation link will expire in 48 hours for security purposes.

      Need help? Contact your team administrator for assistance.
    `.trim();

    const subjectText = userRole
      ? `Reminder: Complete your invitation to join ${companyName} as ${this.emailTemplateService.getRoleDisplayName(userRole)}`
      : `Reminder: Complete your invitation to join ${companyName}`;

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: subjectText,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'Normal',
      },
    });
  }

  async sendExistingUserNotificationEmail(
    email: string,
    companyName: string,
    userRole?: string,
  ) {
    const htmlTemplate =
      this.emailTemplateService.generateExistingUserNotificationTemplate(
        companyName,
        userRole,
      );

    const roleText = this.emailTemplateService.getRoleDisplayText(userRole);
    const textContent = `
      Welcome to ${companyName} on Ground Support Platform!

      ${companyName}

      You already have an account on the Ground Support Platform, and you've been added to ${companyName}${roleText}.

      You can now access ${companyName}'s workspace using your existing login credentials.

      Sign in to Ground Support Platform: ${this.configService.get('FRONTEND_URL')}/select-company

      Need help? Contact your team administrator for assistance.
    `.trim();

    const subjectText = userRole
      ? `You've been added to ${companyName} as ${this.emailTemplateService.getRoleDisplayName(userRole)}`
      : `You've been added to ${companyName}`;

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: subjectText,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'Normal',
      },
    });
  }

  async sendExistingGlobalUserNotificationEmail(
    email: string,
    globalRole: GlobalRole,
  ) {
    const roleDisplayName =
      globalRole === GlobalRole.SANDVIK_ADMIN
        ? 'Sandvik Administrator'
        : 'Sandvik Technician';

    const loginUrl =
      globalRole === GlobalRole.SANDVIK_ADMIN
        ? `${this.configService.get('FRONTEND_URL')}/administration-portal`
        : `${this.configService.get('FRONTEND_URL')}/login`;

    const htmlTemplate =
      this.emailTemplateService.generateExistingGlobalUserNotificationTemplate(
        roleDisplayName,
        loginUrl,
      );

    const textContent = `
      Global Role Assignment - Ground Support Platform

      SANDVIK
      You have been assigned a ${roleDisplayName} role

      You already have an account on the Ground Support Platform, and you've been granted global ${roleDisplayName.toLowerCase()} privileges.

      ${
        globalRole === GlobalRole.SANDVIK_ADMIN
          ? `Access your administration portal: ${loginUrl}`
          : `Sign in to Ground Support Platform: ${loginUrl}`
      }

      Need help? Contact your Sandvik administrator for assistance.
    `.trim();

    const subjectText = `You've been assigned ${roleDisplayName} privileges`;

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: subjectText,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'Normal',
      },
    });
  }

  async sendGlobalInvitationReminderEmail(
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
      this.emailTemplateService.generateGlobalInvitationTemplate(
        inviteUrl,
        roleDisplayName,
      );

    const textContent = `
      Reminder: Your global role invitation is still pending

      SANDVIK
      You have been granted a ${roleDisplayName} role

      Global Access Granted
      This is a reminder that you have a pending global role invitation that provides ${
        globalRole === GlobalRole.SANDVIK_ADMIN
          ? 'platform-wide access across all companies and workspaces with enhanced administrative capabilities.'
          : 'specialized technical access across all companies and workspaces with support capabilities.'
      }

      Please complete your account setup: ${inviteUrl}

      Time-sensitive invitation
      This invitation link will expire in 48 hours for security purposes.

      Note: This invitation was sent by a Sandvik Administrator.
    `.trim();

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: `Reminder: Complete your ${roleDisplayName} invitation to Ground Support Platform`,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'Normal',
      },
    });
  }

  async sendOneTimePassword(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: 'Password reset',
      html: `<p>Your password reset code is: <strong>${otp}</strong></p>`,
    });
  }
}
