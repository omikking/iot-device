import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalRole } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    // Configure nodemailer transporter
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

  async sendInvitationEmail(
    email: string,
    invitationId: string,
    token: string,
    companyName: string,
  ) {
    const inviteUrl = `${this.configService.get('FRONTEND_URL')}/setup-account?id=${invitationId}&token=${token}`;

    const htmlTemplate = this.generateInvitationTemplate(
      inviteUrl,
      companyName,
    );

    const textContent = `
You're Invited to Ground Support Platform!

Welcome to ${companyName}

You have been invited to join the Ground Support Platform, where teams collaborate to maintain the highest standards of safety, efficiency, and operational excellence in industrial environments.

Accept your invitation: ${inviteUrl}

This invitation link will expire in 48 hours for security purposes.

Need help? Contact your team administrator for assistance.

This invitation was sent because someone at ${companyName} invited you to join their Ground Support Platform workspace.
    `.trim();

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: `Invitation to join ${companyName} on Ground Support Platform`,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Content-Type': 'text/html; charset=utf-8',
        'X-Auto-Response-Suppress': 'All',
      },
    });
  }

  //EMAIL NOTIS
  // async sendInvitationEmail(
  //   email: string,
  //   invitationId: string,
  //   token: string,
  //   companyName: string,
  // ) {
  //   const inviteUrl = `${this.configService.get('FRONTEND_URL')}/setup-account?id=${invitationId}&token=${token}`;

  //   await this.transporter.sendMail({
  //     from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
  //     to: email,
  //     subject: 'You have been invited to Ground Support Platform',
  //     html: `
  //       <p>You have been invited to join ${companyName} on Ground Support Platform.</p>
  //       <p>Click the link below to complete your registration:</p>
  //       <p><a href="${inviteUrl}">Complete your registration</a></p>
  //       <p>This link will expire in 48 hours.</p>
  //     `,
  //   });
  // }

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

  private generateInvitationTemplate(
    inviteUrl: string,
    companyName: string,
  ): string {
    // Temporarily using fallback template for better email compatibility
    // TODO: Update template files with table-based layout
    console.log('Using email-compatible fallback template');
    return this.getFallbackInvitationTemplate(inviteUrl, companyName);

    /* Original file-based template loading - temporarily disabled
    const templatePath = path.join(
      process.cwd(),
      'src/email/templates',
      'invitation-template-inline.html',
    );

    try {
      console.log('Attempting to read template from:', templatePath);
      let template = fs.readFileSync(templatePath, 'utf8');
      console.log('Template loaded successfully, length:', template.length);

      // Replace placeholders with actual values
      template = template.replace(/{{INVITE_URL}}/g, inviteUrl);
      template = template.replace(/{{COMPANY_NAME}}/g, companyName);

      return template;
    } catch (error) {
      console.error('Failed to read invitation template:', error);
      console.error('Attempted path:', templatePath);
      console.log('Using fallback template instead');

      // Fallback to inline template if file reading fails
      return this.getFallbackInvitationTemplate(inviteUrl, companyName);
    }
    */
  }

  private generateGlobalInvitationTemplate(
    inviteUrl: string,
    roleDisplayName: string,
  ): string {
    // Temporarily using fallback template for better email compatibility
    // TODO: Update template files with table-based layout
    console.log('Using email-compatible fallback global template');
    return this.getFallbackGlobalInvitationTemplate(inviteUrl, roleDisplayName);

    /* Original file-based template loading - temporarily disabled
    const templatePath = path.join(
      process.cwd(),
      'src/email/templates',
      'global-invitation-template-inline.html',
    );

    try {
      console.log('Attempting to read global template from:', templatePath);
      let template = fs.readFileSync(templatePath, 'utf8');
      console.log(
        'Global template loaded successfully, length:',
        template.length,
      );

      // Replace placeholders with actual values
      template = template.replace(/{{INVITE_URL}}/g, inviteUrl);
      template = template.replace(/{{ROLE_DISPLAY_NAME}}/g, roleDisplayName);

      return template;
    } catch (error) {
      console.error('Failed to read global invitation template:', error);
      console.error('Attempted path:', templatePath);
      console.log('Using fallback global template instead');

      // Fallback to inline template if file reading fails
      return this.getFallbackGlobalInvitationTemplate(
        inviteUrl,
        roleDisplayName,
      );
    }
    */
  }

  private getFallbackInvitationTemplate(
    inviteUrl: string,
    companyName: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Invitation to Ground Support Platform</title>
        </head>
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f8f9fa; font-family: Arial, sans-serif;">
          <tr>
            <td style="padding: 20px;" align="center">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 600px; background-color: white;">
                <tr>
                  <td style="padding: 40px; border-bottom: 2px solid #e9ecef;" align="center">
                    <!-- Sandvik Logo with multiple fallback options -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center" style="background-color: white;">
                          <!--[if mso | IE]>
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center">
                                <img src="${this.configService.get('LOGO_URL') || this.configService.get('API_URL') || 'http://localhost:3333'}/assets/Sandvik-logo.png" 
                                     alt="SANDVIK" 
                                     width="180" 
                                     height="60" 
                                     style="width:180px; height:60px; display:block;" 
                                     border="0" />
                              </td>
                            </tr>
                          </table>
                          <![endif]-->
                          <!--[if !mso]><!-->
                          <img src="${this.configService.get('LOGO_URL') || this.configService.get('API_URL') || 'http://localhost:3333'}/assets/Sandvik-logo.png" 
                               alt="SANDVIK" 
                               width="180" 
                               height="auto" 
                               style="display: block; margin: 0 auto; max-width: 180px; height: auto; width: 180px;"
                               border="0">
                          <!--<![endif]-->
                          <!-- Text fallback if image doesn't load -->
                          <div style="display: none; max-height: 0; overflow: hidden;">
                            <h1 style="font-size: 28px; font-weight: bold; color: #2c3e50; margin: 20px 0; letter-spacing: 3px; text-align: center;">SANDVIK</h1>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px;" align="center">
                    <h2 style="font-size: 32px; font-weight: bold; color: #2c3e50; margin: 0 0 20px 0;">You're Invited!</h2>
                    
                    <p style="font-size: 18px; color: #495057; margin: 25px 0;">
                      Welcome to <strong style="color: #327DFF;">${companyName}</strong>
                    </p>
                    
                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0;">
                      You have been invited to join the Ground Support Platform, where teams collaborate to maintain the highest standards of safety, efficiency, and operational excellence in industrial environments.
                    </p>
                    
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 40px auto;">
                      <tr>
                        <td style="background-color: #327DFF; padding: 18px 36px;" align="center">
                          <a href="${inviteUrl}" style="color: white; font-weight: bold; font-size: 16px;">Accept Invitation</a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0;">
                      This invitation link will expire in 48 hours for security purposes.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 30px 40px 40px 40px; border-top: 1px solid #e9ecef;" align="center">
                    <p style="font-size: 14px; color: #6c757d; margin: 10px 0;">Need help? Contact your team administrator for assistance.</p>
                    <p style="font-size: 12px; color: #adb5bd; margin: 10px 0;">
                      This invitation was sent because someone at ${companyName} invited you to join their Ground Support Platform workspace.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </html>
    `;
  }

  private getFallbackGlobalInvitationTemplate(
    inviteUrl: string,
    roleDisplayName: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Global Role Invitation - Ground Support Platform</title>
        </head>
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f8f9fa; font-family: Arial, sans-serif;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 600px; background-color: white; max-width: 600px;">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 2px solid #e9ecef;">
                    <!-- Sandvik Logo with better structure -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center" style="background-color: white;">
                          <img src="${this.configService.get('API_URL') || 'http://localhost:3333'}/assets/Sandvik-logo.png" 
                               alt="SANDVIK" 
                               width="180" 
                               height="auto" 
                               style="display: block; margin: 0 auto; max-width: 180px; height: auto;"
                               border="0">
                        </td>
                      </tr>
                    </table>
                    <p style="font-size: 16px; color: #6c757d; margin: 15px 0 20px 0;">Industrial Safety & Operations Management</p>
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 10px auto;">
                      <tr>
                        <td align="center" style="background-color: #28a745; color: white; padding: 12px 24px;">
                          <strong style="font-weight: 600; font-size: 16px;">${roleDisplayName}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td align="center" style="padding: 40px;">
                    <h2 style="font-size: 32px; font-weight: 700; color: #2c3e50; margin: 0 0 20px 0;">Global Access Invitation</h2>
                    
                    <p style="font-size: 18px; color: #495057; margin: 25px 0;">
                      You have been granted a <strong>${roleDisplayName}</strong> role
                    </p>
                    
                    <!-- Info Box -->
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 30px 0; border: 2px solid #90caf9; background-color: #e3f2fd;">
                      <tr>
                        <td align="center" style="padding: 25px;">
                          <h3 style="margin: 0 0 15px 0; color: #1976d2; font-size: 20px; font-weight: 600;">🌐 Global Access Granted</h3>
                          <p style="margin: 0; color: #495057; font-size: 16px;">This role provides platform-wide access across all companies and workspaces with enhanced administrative capabilities.</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Button -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 40px auto;">
                      <tr>
                        <td align="center" style="background-color: #28a745; padding: 18px 36px;">
                          <a href="${inviteUrl}" style="color: white; font-weight: 600; font-size: 16px;">Accept Global Role Invitation</a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Warning Box -->
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 30px 0; border: 1px solid #ffd700; background-color: #fff3cd;">
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
                  <td align="center" style="padding: 30px 40px 40px 40px; border-top: 1px solid #e9ecef;">
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
      </html>
    `;
  }
}
