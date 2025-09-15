import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalRole } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
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
    userRole?: string, // Add optional role parameter
  ) {
    const inviteUrl = `${this.configService.get('FRONTEND_URL')}/setup-account?id=${invitationId}&token=${token}`;

    const htmlTemplate = this.generateInvitationTemplate(
      inviteUrl,
      companyName,
      userRole,
    );

    // Generate role-specific text content
    const roleText = this.getRoleDisplayText(userRole);
    const textContent = `
      You're Invited to Ground Support Platform!

      Welcome to ${companyName}

      You have been invited to join ${companyName} on the Ground Support Platform${roleText}.

      Accept your invitation: ${inviteUrl}

      This invitation link will expire in 48 hours for security purposes.

      Need help? Contact your team administrator for assistance.
    `.trim();

    const subjectText = userRole
      ? `You're invited to join ${companyName} as ${this.getRoleDisplayName(userRole)}`
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

    const htmlTemplate = this.generateGlobalInvitationTemplate(
      inviteUrl,
      roleDisplayName,
    );

    const textContent = `
      Global Access Invitation - Ground Support Platform

      SANDVIK
      You have been granted a ${roleDisplayName} role

      🌐 Global Access Granted
      This role provides platform-wide access across all companies and workspaces with enhanced administrative capabilities.

      Accept your global role invitation: ${inviteUrl}

      ⏰ Time-sensitive invitation
      This invitation link will expire in 48 hours for security purposes.

      Note: This invitation was sent by a Sandvik Administrator.
      This invitation grants elevated privileges across the entire Ground Support Platform.
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
        htmlTemplate = this.createInvitationTemplate(
          inviteUrl,
          companyName!,
          'COMPANY_ADMIN',
        );
        textContent = this.generateTextContent(
          inviteUrl,
          companyName!,
          'COMPANY_ADMIN',
        );
        break;

      case 'company-user':
        subject = `You're invited to join ${companyName}`;
        htmlTemplate = this.createInvitationTemplate(
          inviteUrl,
          companyName!,
          'COMPANY_USER',
        );
        textContent = this.generateTextContent(
          inviteUrl,
          companyName!,
          'COMPANY_USER',
        );
        break;

      case 'technician':
        subject = `You're invited to join Ground Support Platform as a technician`;
        htmlTemplate = this.createGlobalInvitationTemplate(
          inviteUrl,
          'Sandvik Technician',
        );
        textContent = this.generateGlobalTextContent(
          inviteUrl,
          'Sandvik Technician',
        );
        break;

      case 'global-admin':
        subject = `You're invited to join Ground Support Platform as an administrator`;
        htmlTemplate = this.createGlobalInvitationTemplate(
          inviteUrl,
          'Sandvik Administrator',
        );
        textContent = this.generateGlobalTextContent(
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

  // ================================================================================
  // PRIVATE CONTENT GENERATION METHODS
  // ================================================================================

  private generateTextContent(
    inviteUrl: string,
    companyName: string,
    role: string,
  ): string {
    const invitationHeading = this.getInvitationHeading(role, companyName);

    return `
      You're Invited to Ground Support Platform!

      ${invitationHeading}

      Please complete your account setup to get started.

      Accept your invitation: ${inviteUrl}

      This invitation link will expire in 48 hours for security purposes.

      Need help? Contact your team administrator for assistance.
    `.trim();
  }

  private generateGlobalTextContent(
    inviteUrl: string,
    roleDisplayName: string,
  ): string {
    return `
      Global Access Invitation - Ground Support Platform

      You have been granted a ${roleDisplayName} role

      Accept your global role invitation: ${inviteUrl}

      This invitation link will expire in 48 hours for security purposes.

      Need help? Contact your team administrator for assistance.
    `.trim();
  }

  private generateInvitationTemplate(
    inviteUrl: string,
    companyName: string,
    userRole?: string,
  ): string {
    return this.createInvitationTemplate(inviteUrl, companyName, userRole);
  }

  private generateGlobalInvitationTemplate(
    inviteUrl: string,
    roleDisplayName: string,
  ): string {
    return this.createGlobalInvitationTemplate(inviteUrl, roleDisplayName);
  }

  // ================================================================================
  // PRIVATE HTML TEMPLATE METHODS
  // ================================================================================

  private createInvitationTemplate(
    inviteUrl: string,
    companyName: string,
    userRole?: string,
  ): string {
    const invitationHeading = this.getInvitationHeading(userRole, companyName);

    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation to Ground Support Platform</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f8f9fa;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 600px; max-width: 600px; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                
                <!-- Header with Logo -->
                <tr>
                  <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 2px solid #e9ecef;">
                    <h1 style="font-size: 28px; font-weight: bold; color: #2c3e50; margin: 0; letter-spacing: 3px;">SANDVIK</h1>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;" align="center">
                    <h2 style="font-size: 16px; font-weight: bold; color: #2c3e50; margin: 0 0 20px 0;">${invitationHeading}</h2>
                    
                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0; line-height: 1.6;">
                      Please complete your account setup to get started.
                    </p>
                    
                    <!-- Call to Action Button -->
                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 40px auto;">
                      <tr>
                        <td align="center" style="background-color: #327DFF; border-radius: 5px; padding: 0;">
                          <a href="${inviteUrl}" style="background-color: #327DFF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: block; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif; text-align: center; min-width: 140px;">Accept Invitation</a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="font-size: 14px; color: #6c757d; margin: 25px 0;">
                      This invitation link will expire in 48 hours for security purposes.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e9ecef; background-color: #f8f9fa;" align="center">
                    <p style="font-size: 14px; color: #6c757d; margin: 10px 0;">Need help? Contact your team administrator for assistance.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
  }

  private createGlobalInvitationTemplate(
    inviteUrl: string,
    roleDisplayName: string,
  ): string {
    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Global Role Invitation - Ground Support Platform</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f8f9fa;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 600px; max-width: 600px; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 2px solid #e9ecef;">
                    <h1 style="font-size: 28px; font-weight: 700; color: #2c3e50; margin: 0 0 15px 0; letter-spacing: 3px;">SANDVIK</h1>
                    <p style="font-size: 16px; color: #6c757d; margin: 0 0 20px 0;">Industrial Safety & Operations Management</p>
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 10px auto;">
                      <tr>
                        <td align="center" style="background-color: #28a745; color: white; padding: 12px 24px; border-radius: 5px;">
                          <strong style="font-weight: 600; font-size: 16px;">${roleDisplayName}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td align="center" style="padding: 40px;">
                    <h2 style="font-size: 16px; font-weight: 700; color: #2c3e50; margin: 0 0 20px 0;">Global Access Invitation</h2>
                    
                    <p style="font-size: 18px; color: #495057; margin: 25px 0;">
                      You have been granted a <strong>${roleDisplayName}</strong> role
                    </p>
                    
                    <!-- Info Box -->
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 30px 0; border: 2px solid #90caf9; background-color: #e3f2fd; border-radius: 5px;">
                      <tr>
                        <td align="center" style="padding: 25px;">
                          <h3 style="margin: 0 0 15px 0; color: #1976d2; font-size: 20px; font-weight: 600;">🌐 Global Access Granted</h3>
                          <p style="margin: 0; color: #495057; font-size: 16px;">This role provides platform-wide access across all companies and workspaces with enhanced administrative capabilities.</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Button -->
                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 40px auto;">
                      <tr>
                        <td align="center" style="background-color: #28a745; border-radius: 5px; padding: 0;">
                          <a href="${inviteUrl}" style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: block; font-weight: 600; font-size: 16px; font-family: Arial, sans-serif; text-align: center; min-width: 180px;">Accept Global Role Invitation</a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Warning Box -->
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 30px 0; border: 1px solid #ffd700; background-color: #fff3cd; border-radius: 5px;">
                      <tr>
                        <td align="center" style="padding: 20px; color: #856404;">
                          <strong>⏰ Time-sensitive invitation</strong><br>
                          This invitation link will expire in 48 hours for security purposes.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 30px 40px; border-top: 1px solid #e9ecef; background-color: #f8f9fa;">
                    <p style="font-size: 14px; color: #6c757d; margin: 10px 0;"><em>Note: This invitation was sent by a Sandvik Administrator.</em></p>
                    <p style="font-size: 12px; color: #adb5bd; margin: 10px 0;">
                      This invitation grants elevated privileges across the entire Ground Support Platform.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
  }

  private getRoleDisplayName(role?: string): string {
    switch (role?.toUpperCase()) {
      case 'COMPANY_ADMIN':
        return 'an administrator';
      case 'COMPANY_USER':
        return 'a user';
      case 'SANDVIK_ADMIN':
        return 'a Sandvik administrator';
      case 'SANDVIK_TECHNICIAN':
        return 'a technician';
      default:
        return 'a team member';
    }
  }

  private getRoleDisplayText(role?: string): string {
    switch (role?.toUpperCase()) {
      case 'COMPANY_ADMIN':
        return ' as an administrator. You will have administrative privileges within your company workspace';
      case 'COMPANY_USER':
        return ' as a user. You will be able to collaborate with your team on safety and operational tasks';
      case 'SANDVIK_ADMIN':
        return ' with Sandvik administrator privileges. You will have platform-wide access and enhanced capabilities';
      case 'SANDVIK_TECHNICIAN':
        return ' as a technician. You will have specialized access to technical features and support tools';
      default:
        return ' as a team member. You will be able to collaborate with your team on safety and operational excellence';
    }
  }

  private getInvitationHeading(role?: string, companyName?: string): string {
    switch (role?.toUpperCase()) {
      case 'COMPANY_ADMIN':
        return `You're invited to join ${companyName} as an administrator.`;
      case 'COMPANY_USER':
        return `You're invited to join ${companyName} as a user.`;
      case 'SANDVIK_ADMIN':
        return `You're invited to join Ground Support Platform as an administrator.`;
      case 'SANDVIK_TECHNICIAN':
        return `You're invited to join Ground Support Platform as a technician.`;
      default:
        return `You're invited to join ${companyName} as a team member.`;
    }
  }
}
