import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailTemplateService {
  constructor(private configService: ConfigService) {}

  getRoleDisplayName(role?: string): string | undefined {
    switch (role?.toUpperCase()) {
      case 'COMPANY_ADMIN':
        return 'an administrator';
      case 'COMPANY_USER':
        return 'a contributor';
      case 'SANDVIK_ADMIN':
        return 'a Sandvik administrator';
      case 'SANDVIK_TECHNICIAN':
        return 'a Sandvik technician';
    }
  }

  getRoleDisplayText(role?: string): string | undefined {
    switch (role?.toUpperCase()) {
      case 'COMPANY_ADMIN':
        return ' as an administrator. You will have administrative privileges within your company workspace';
      case 'COMPANY_USER':
        return '. You will be able to collaborate with your team on safety and operational tasks';
      case 'SANDVIK_ADMIN':
        return ' with Sandvik administrator privileges. You will have platform-wide access';
      case 'SANDVIK_TECHNICIAN':
        return ' as a technician. You will have specialized access to technical features and support tools';
    }
  }

  getInvitationHeading(
    role?: string,
    companyName?: string,
  ): string | undefined {
    switch (role?.toUpperCase()) {
      case 'COMPANY_ADMIN':
        return `You're invited to join <strong>${companyName}</strong> as an administrator.`;
      case 'COMPANY_USER':
        return `You're invited to join <strong>${companyName}</strong>.`;
      case 'SANDVIK_ADMIN':
        return `You're invited to join <strong>Ground Support Platform</strong> as an administrator.`;
      case 'SANDVIK_TECHNICIAN':
        return `You're invited to join <strong>Ground Support Platform</strong> as a technician.`;
    }
  }

  // ================================================================================
  // HTML TEMPLATE METHODS
  // ================================================================================

  public buildInvitationTemplate(
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
                    <h2 style="font-size: 16px; color: #2c3e50; margin: 0 0 20px 0;">${invitationHeading}</h2>
                    
                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0; line-height: 1.5;">
                      Please setup your account to get started.
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
                      This invitation link will expire in 48 hours.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e9ecef; background-color: #f8f9fa;" align="center">
                    <p style="font-size: 14px; color: #6c757d; margin: 10px 0;">Need help? Contact your administrator for assistance.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
  }

  public buildGlobalInvitationTemplate(
    inviteUrl: string,
    roleDisplayName: string,
  ): string {
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
                    <h2 style="font-size: 16px; font-weight: 700; color: #2c3e50; margin: 0 0 20px 0;">Invitation to Ground Support Platform</h2>
                    
                    <p style="font-size: 18px; color: #495057; margin: 25px 0; line-height: 1.5;">
                      You have been invited to join Ground Support Platform as a <strong>${roleDisplayName}</strong>
                    </p>
                    
                    <!-- Info Box -->
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 30px 0; border: 2px solid #90caf9; background-color: #e3f2fd; border-radius: 5px;">
                      <tr>
                        <td align="center" style="padding: 25px;">

                          <h3 style="margin: 0 0 15px 0; color: #1976d2; font-size: 20px; font-weight: 600;">${
                            roleDisplayName === 'Sandvik Administrator'
                              ? 'Sandvik Administrator Access'
                              : 'Sandvik Technician Access'
                          }</h3>
                          <p style="margin: 0; color: #495057; font-size: 16px; line-height: 1.5;">${
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
                        <p style="font-size: 16px; color: #6c757d; margin: 40px 0; line-height: 1.5;">
                          Please setup your account to get started.
                        </p>  
                        <td align="center" style="background-color: #1441F5; border-radius: 5px; padding: 0;">
                          <a href="${inviteUrl}" style="background-color: #1441F5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: block; font-weight: 600; font-size: 16px; font-family: Arial, sans-serif; text-align: center; min-width: 180px;">Accept Invitation</a>
                        </td>
                      </tr>
                    </table>
                    <p style="font-size: 14px; color: #6c757d; margin: 24px 0 10px;">
                      This invitation link will expire in 48 hours.
                    </p>
                    <p style="font-size: 14px; color: #6c757d; margin: 10px 0;">Need help? Contact your administrator for assistance.</p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 30px 40px; border-top: 1px solid #e9ecef; background-color: #f8f9fa;">
                    <p style="font-size: 14px; color: #6c757d; margin: 10px 0;"><em>Note: This invitation was sent by a Sandvik Administrator.</em></p>
                    <p style="font-size: 12px; color: #adb5bd; margin: 10px 0;">
                      This invitation grants privileges across Ground Support Platform.
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

  public buildExistingUserNotificationTemplate(
    userRole: string,
    companyName: string,
  ): string {
    const loginUrl = `${this.configService.get('FRONTEND_URL')}/api/auth/signin`;

    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You have access to ${companyName} in Ground Support Platform</title>
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
                    <h2 style="font-size: 18px; font-weight: normal; color: #2c3e50; margin: 0 0 20px 0;">You've been assigned as <strong>${userRole}</strong> in <strong>${companyName}</strong>.</h2>
                    
                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0; line-height: 1.5;">
                      You can now access ${companyName}'s workspace.
                    </p>
                    
                    <!-- Call to Action Button -->
                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 40px auto;">
                      <tr>
                        <td align="center" style="background-color: #1441F5; border-radius: 5px; padding: 0;">
                          <a href="${loginUrl}" style="background-color: #1441F5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: block; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif; text-align: center; min-width: 140px;">Sign In</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e9ecef; background-color: #f8f9fa;" align="center">
                    <p style="font-size: 14px; color: #6c757d; margin: 10px 0;">Need help? Contact your administrator for assistance.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
  }

  public buildExistingGlobalUserNotificationTemplate(
    roleDisplayName: string,
  ): string {
    const loginUrl = `${this.configService.get('FRONTEND_URL')}/api/auth/signin`;

    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New access in Ground Support Platform</title>
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
                    <h2 style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 0 0 20px 0;">${roleDisplayName} Assignment</h2>

                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0; line-height: 1.5;">
                      You've been assigned as <strong>${roleDisplayName}</strong> in Ground Support Platform.
                    </p>
                    
                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0; line-height: 1.5;">
                      ${
                        roleDisplayName === 'Sandvik Administrator'
                          ? 'You now have access to the administration portal with platform-wide management capabilities.'
                          : 'You can now access technical features and support tools across all company workspaces.'
                      }
                    </p>
                    
                    <!-- Call to Action Button -->
                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 40px auto;">
                      <tr>
                        <td align="center" style="background-color: #1441F5; border-radius: 5px; padding: 0;">
                          <a href="${loginUrl}" style="background-color: #1441F5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: block; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif; text-align: center; min-width: 140px;">Sign In</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e9ecef; background-color: #f8f9fa;" align="center">
                    <p style="font-size: 14px; color: #6c757d; margin: 10px 0;">Need help? Contact your administrator for assistance.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
  }

  public buildPasswordResetTemplate(otp: string): string {
    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Ground Support Platform</title>
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
                    <h2 style="font-size: 24px; color: #2c3e50; margin: 0 0 20px 0;">Password Reset Request</h2>
                    
                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0; line-height: 1.5;">
                      You have requested to reset your password. Use the verification code below to proceed with your password reset.
                    </p>
                    
                    <!-- OTP Display -->
                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 40px auto; background-color: #f8f9fa; border-radius: 8px; padding: 20px;">
                      <tr>
                        <td align="center">
                          <p style="font-size: 14px; color: #6c757d; margin: 0 0 10px 0; font-weight: bold;">Your verification code:</p>
                          <div style="font-size: 32px; font-weight: bold; color: #1441F5; font-family: 'Courier New', monospace; letter-spacing: 4px; margin: 10px 0;">${otp}</div>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="font-size: 14px; color: #dc3545; margin: 25px 0; font-weight: bold;">
                      This code will expire in 30 minutes.
                    </p>
                    
                    <p style="font-size: 14px; color: #6c757d; margin: 25px 0; line-height: 1.5;">
                      If you did not request this password reset, please ignore this email or contact your administrator.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e9ecef; background-color: #f8f9fa;" align="center">
                    <p style="font-size: 14px; color: #6c757d; margin: 10px 0;">Need help? Contact your administrator for assistance.</p>
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
