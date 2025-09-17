import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailTemplateService {
  constructor(private configService: ConfigService) {}

  // ================================================================================
  // PUBLIC TEMPLATE GENERATION METHODS
  // ================================================================================

  generateInvitationTemplate(
    inviteUrl: string,
    companyName: string,
    userRole?: string,
  ): string {
    return this.createInvitationTemplate(inviteUrl, companyName, userRole);
  }

  generateGlobalInvitationTemplate(
    inviteUrl: string,
    roleDisplayName: string,
  ): string {
    return this.createGlobalInvitationTemplate(inviteUrl, roleDisplayName);
  }

  generateExistingUserNotificationTemplate(
    companyName: string,
    userRole?: string,
  ): string {
    return this.createExistingUserNotificationTemplate(companyName, userRole);
  }

  generateExistingGlobalUserNotificationTemplate(
    roleDisplayName: string,
    loginUrl: string,
  ): string {
    return this.createExistingGlobalUserNotificationTemplate(
      roleDisplayName,
      loginUrl,
    );
  }

  // ================================================================================
  // TEXT CONTENT GENERATION METHODS
  // ================================================================================

  generateTextContent(
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

  generateGlobalTextContent(
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

  // ================================================================================
  // ROLE UTILITY METHODS
  // ================================================================================

  getRoleDisplayName(role?: string): string {
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

  getRoleDisplayText(role?: string): string {
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

  getInvitationHeading(role?: string, companyName?: string): string {
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
                    <h1 style="font-size: 28px; font-weight: 700; color: #2c3e50; margin: 0 0 15px 0; letter-spacing: 3px;">SANDVIK</h1>
                    <p style="font-size: 16px; color: #6c757d; margin: 0 0 20px 0;">Ground Support Platform</p>
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
                        <td align="center" style="background-color: #1441F5; border-radius: 5px; padding: 0;">
                          <a href="${inviteUrl}" style="background-color: #1441F5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: block; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif; text-align: center; min-width: 140px;">Accept Invitation</a>
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
                    <p style="font-size: 16px; color: #6c757d; margin: 0 0 20px 0;">Ground Support Platform</p>
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

                          <h3 style="margin: 0 0 15px 0; color: #1976d2; font-size: 20px; font-weight: 600;">${
                            roleDisplayName === 'Sandvik Administrator'
                              ? 'Global Access Granted'
                              : 'Technical Access Granted'
                          }</h3>
                          <p style="margin: 0; color: #495057; font-size: 16px;">${
                            roleDisplayName === 'Sandvik Administrator'
                              ? 'This role provides platform-wide access across all companies and workspaces with enhanced administrative capabilities.'
                              : 'This role provides specialized technical access across all companies and workspaces with support capabilities.'
                          }</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Button -->
                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 40px auto;">
                      <tr>
                        <td align="center" style="background-color: #1441F5; border-radius: 5px; padding: 0;">
                          <a href="${inviteUrl}" style="background-color: #1441F5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: block; font-weight: 600; font-size: 16px; font-family: Arial, sans-serif; text-align: center; min-width: 180px;">Accept Invitation</a>
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

  private createExistingUserNotificationTemplate(
    companyName: string,
    userRole?: string,
  ): string {
    const loginUrl = `${this.configService.get('FRONTEND_URL')}/select-company`;

    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${companyName} - Ground Support Platform</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f8f9fa;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 600px; max-width: 600px; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                
                <!-- Header with Logo -->
                <tr>
                  <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 2px solid #e9ecef;">
                    <h1 style="font-size: 28px; font-weight: bold; color: #2c3e50; margin: 0 0 15px 0; letter-spacing: 3px;">SANDVIK</h1>
                    <p style="font-size: 16px; color: #6c757d; margin: 0 0 20px 0;">Ground Support Platform</p>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;" align="center">
                    <h2 style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 0 0 20px 0;">Welcome to ${companyName}!</h2>
                    
                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0; line-height: 1.6;">
                      You already have an account on the Ground Support Platform, and you've been added to ${companyName}${userRole ? ` as ${this.getRoleDisplayName(userRole)}` : ''}.
                    </p>
                    
                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0; line-height: 1.6;">
                      You can now access ${companyName}'s workspace using your existing login credentials.
                    </p>
                    
                    <!-- Call to Action Button -->
                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 40px auto;">
                      <tr>
                        <td align="center" style="background-color: #1441F5; border-radius: 5px; padding: 0;">
                          <a href="${loginUrl}" style="background-color: #1441F5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: block; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif; text-align: center; min-width: 140px;">View Company</a>
                        </td>
                      </tr>
                    </table>
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

  private createExistingGlobalUserNotificationTemplate(
    roleDisplayName: string,
    loginUrl: string,
  ): string {
    const buttonText =
      roleDisplayName === 'Sandvik Administrator'
        ? 'Access Administration Portal'
        : 'Sign In';

    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Global Role Assignment - Ground Support Platform</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f8f9fa;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 600px; max-width: 600px; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                
                <!-- Header with Logo -->
                <tr>
                  <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 2px solid #e9ecef;">
                    <h1 style="font-size: 28px; font-weight: bold; color: #2c3e50; margin: 0 0 15px 0; letter-spacing: 3px;">SANDVIK</h1>
                    <p style="font-size: 16px; color: #6c757d; margin: 0 0 20px 0;">Ground Support Platform</p>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;" align="center">
                    <h2 style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 0 0 20px 0;">Global Role Assignment</h2>
                    
                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0; line-height: 1.6;">
                      You already have an account on the Ground Support Platform, and you've been granted global <strong>${roleDisplayName.toLowerCase()}</strong> privileges.
                    </p>
                    
                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0; line-height: 1.6;">
                      ${
                        roleDisplayName === 'Sandvik Administrator'
                          ? 'You now have access to the administration portal with platform-wide management capabilities.'
                          : 'You can now access technical features and support tools across all company workspaces.'
                      }
                    </p>
                    
                    <!-- Call to Action Button -->
                    ${
                      roleDisplayName === 'Sandvik Administrator'
                        ? `<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 40px auto;">
                           <tr>
                             <td align="center" style="background-color: #1441F5; border-radius: 5px; padding: 0;">
                               <a href="${loginUrl}" style="background-color: #1441F5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: block; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif; text-align: center; min-width: 140px;">${buttonText}</a>
                             </td>
                           </tr>
                           </table>`
                        : ''
                    }
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e9ecef; background-color: #f8f9fa;" align="center">
                    <p style="font-size: 14px; color: #6c757d; margin: 10px 0;">Need help? Contact your Sandvik administrator for assistance.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
  }
}
