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

  public buildSharePlotListTemplate(companyName: string, sharedByUser: string) {
    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Plot List shared with you</title>
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
                    <p style="font-size: 16px; color: #6c757d; margin: 0;">Ground Support Platform</p>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;" align="center">
                    <h2 style="font-size: 18px; color: #2c3e50; margin: 0 0 20px 0;">A plot list has been shared with you</h2>

                    <p style="font-size: 16px; color: #6c757d; margin: 25px 0; line-height: 1.5;">
                      A plot list report has been generated and attached to this email.
                    </p>

                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 20px 0 0 0; background-color: #f8f9fa; border-radius: 6px;">
                      <tr>
                        <td style="padding: 16px 20px;" align="left">
                          <p style="margin: 0 0 6px 0; font-size: 14px; color: #2c3e50;"><strong>Company:</strong> ${companyName}</p>
                          <p style="margin: 0; font-size: 14px; color: #2c3e50;"><strong>Shared By:</strong> ${sharedByUser}</p>
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

  public buildContactUsTemplate(
    companyName: string,
    message: string,
    attachmentsCount: number,
  ) {
    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Us request</title>
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
                    <p style="font-size: 16px; color: #6c757d; margin: 0;">Ground Support Platform</p>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="font-size: 18px; color: #2c3e50; margin: 0 0 20px 0;">New Contact Us request</h2>

                    <p style="font-size: 14px; color: #2c3e50; margin: 0 0 4px 0;"><strong>Company:</strong> ${companyName}</p>

                    <h3 style="font-size: 15px; color: #2c3e50; margin: 24px 0 8px 0;">Message</h3>
                    <p style="margin: 0 0 24px 0; padding: 12px 16px; background: #f5f5f5; border-radius: 6px; font-size: 14px; color: #495057; line-height: 1.5;">
                      ${message || 'No message provided'}
                    </p>

                    <p style="font-size: 14px; color: #2c3e50; margin: 0;"><strong>Attachments:</strong> ${attachmentsCount}</p>
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

  public buildOrderDetailsTemplate(data: {
    orderId: string;
    status: string;
    orderDate: string;
    companyName: string;
    sharedByUser: string;
    message: string;
    attachmentNames: string[];
    items: Array<{
      type: string;
      label: string;
      location: string;
      period?: number | null;
      status: string;
    }>;
  }): string {
    const escape = (value: string): string =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const itemRows = data.items.length
      ? data.items
          .map(
            (item, index) => `
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #e9ecef; font-size: 13px; color: #6c757d;">${index + 1}</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #e9ecef; font-size: 13px; color: #2c3e50;">${escape(item.type)}</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #e9ecef; font-size: 13px; color: #2c3e50;">${escape(item.label)}</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #e9ecef; font-size: 13px; color: #6c757d;">${escape(item.location)}</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #e9ecef; font-size: 13px; color: #6c757d; text-align: center;">${item.period ?? '-'}</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #e9ecef; font-size: 13px; color: #6c757d;">${escape(item.status)}</td>
                </tr>`,
          )
          .join('')
      : `<tr><td colspan="6" style="padding: 16px; text-align: center; font-size: 13px; color: #6c757d;">No items in this order.</td></tr>`;

    const attachmentsBlock = data.attachmentNames.length
      ? `<ul style="margin: 8px 0 0 0; padding-left: 20px; color: #2c3e50; font-size: 14px;">
            ${data.attachmentNames
              .map((name) => `<li style="margin: 4px 0;">${escape(name)}</li>`)
              .join('')}
         </ul>`
      : `<p style="margin: 8px 0 0 0; font-size: 14px; color: #6c757d;">No attachments.</p>`;

    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Banshee Order Placed</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f8f9fa;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 680px; max-width: 680px; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

                <!-- Header with Logo -->
                <tr>
                  <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 2px solid #e9ecef;">
                    <h1 style="font-size: 28px; font-weight: 700; color: #2c3e50; margin: 0 0 15px 0; letter-spacing: 3px;">SANDVIK</h1>
                    <p style="font-size: 16px; color: #6c757d; margin: 0;">Ground Support Platform</p>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="font-size: 20px; color: #2c3e50; margin: 0 0 8px 0;">A new Banshee order has been placed</h2>
                    <p style="font-size: 14px; color: #6c757d; margin: 0 0 24px 0; line-height: 1.5;">
                      ${escape(data.sharedByUser)} placed a new order for <strong>${escape(data.companyName)}</strong>.
                    </p>

                    <!-- Order Summary -->
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 0 24px 0; background-color: #f8f9fa; border-radius: 6px;">
                      <tr>
                        <td style="padding: 16px 20px;">
                          <p style="margin: 0 0 6px 0; font-size: 14px; color: #2c3e50;"><strong>Order ID:</strong> ${escape(data.orderId)}</p>
                          <p style="margin: 0 0 6px 0; font-size: 14px; color: #2c3e50;"><strong>Status:</strong> ${escape(data.status)}</p>
                          <p style="margin: 0 0 6px 0; font-size: 14px; color: #2c3e50;"><strong>Placed By:</strong> ${escape(data.sharedByUser)}</p>
                          <p style="margin: 0; font-size: 14px; color: #2c3e50;"><strong>Date:</strong> ${escape(data.orderDate)}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Message -->
                    <h3 style="font-size: 15px; color: #2c3e50; margin: 0 0 8px 0;">Message</h3>
                    <p style="margin: 0 0 24px 0; padding: 12px 16px; background: #f5f5f5; border-radius: 6px; font-size: 14px; color: #495057; line-height: 1.5;">
                      ${data.message ? escape(data.message) : 'No message provided.'}
                    </p>

                    <!-- Order Items -->
                    <h3 style="font-size: 15px; color: #2c3e50; margin: 0 0 8px 0;">Order Items (${data.items.length})</h3>
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 0 24px 0; border: 1px solid #e9ecef; border-radius: 6px; border-collapse: collapse;">
                      <thead>
                        <tr style="background-color: #f1f3f5;">
                          <th align="left" style="padding: 10px 12px; font-size: 12px; color: #6c757d; text-transform: uppercase;">#</th>
                          <th align="left" style="padding: 10px 12px; font-size: 12px; color: #6c757d; text-transform: uppercase;">Type</th>
                          <th align="left" style="padding: 10px 12px; font-size: 12px; color: #6c757d; text-transform: uppercase;">Item</th>
                          <th align="left" style="padding: 10px 12px; font-size: 12px; color: #6c757d; text-transform: uppercase;">Location</th>
                          <th align="center" style="padding: 10px 12px; font-size: 12px; color: #6c757d; text-transform: uppercase;">Period</th>
                          <th align="left" style="padding: 10px 12px; font-size: 12px; color: #6c757d; text-transform: uppercase;">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemRows}
                      </tbody>
                    </table>

                    <!-- Attachments -->
                    <h3 style="font-size: 15px; color: #2c3e50; margin: 0 0 4px 0;">Attachments (${data.attachmentNames.length})</h3>
                    ${attachmentsBlock}
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

  /**
   * Consolidated insights email for Flow 1. Summarises every measurement
   * received in a sync for a company, split into a measured and a not-measured
   * table, following the same SANDVIK card layout used by the order template.
   */
  public buildProceqMeasurementInsightsTemplate(data: {
    measured: Array<{
      serialNumber: string;
      bansheeName: string | null;
      measurementId: string;
      status: string;
    }>;
    notMeasured: Array<{
      serialNumber: string;
      bansheeName: string | null;
      measurementId: string;
      status: string;
    }>;
  }): string {
    const escape = (value: string): string =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const buildRows = (
      items: Array<{
        serialNumber: string;
        bansheeName: string | null;
        measurementId: string;
        status: string;
      }>,
    ): string =>
      items.length
        ? items
            .map((item) => {
              const label = item.bansheeName
                ? `${escape(item.bansheeName)} (${escape(item.serialNumber)})`
                : escape(item.serialNumber);
              return `
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #e9ecef; font-size: 13px; color: #2c3e50;">${label}</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #e9ecef; font-size: 13px; color: #6c757d;">${escape(item.measurementId)}</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #e9ecef; font-size: 13px; color: #6c757d;">${escape(item.status)}</td>
                </tr>`;
            })
            .join('')
        : `<tr><td colspan="3" style="padding: 16px; text-align: center; font-size: 13px; color: #6c757d;">None.</td></tr>`;

    const tableHead = `
                      <thead>
                        <tr style="background-color: #f1f3f5;">
                          <th align="left" style="padding: 10px 12px; font-size: 12px; color: #6c757d; text-transform: uppercase;">Banshee</th>
                          <th align="left" style="padding: 10px 12px; font-size: 12px; color: #6c757d; text-transform: uppercase;">Measurement ID</th>
                          <th align="left" style="padding: 10px 12px; font-size: 12px; color: #6c757d; text-transform: uppercase;">Status</th>
                        </tr>
                      </thead>`;

    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Proceq Measurement Summary</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f8f9fa;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 680px; max-width: 680px; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

                <!-- Header with Logo -->
                <tr>
                  <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 2px solid #e9ecef;">
                    <h1 style="font-size: 28px; font-weight: 700; color: #2c3e50; margin: 0 0 15px 0; letter-spacing: 3px;">SANDVIK</h1>
                    <p style="font-size: 16px; color: #6c757d; margin: 0;">Ground Support Platform</p>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="font-size: 20px; color: #2c3e50; margin: 0 0 8px 0;">Proceq measurement summary</h2>
                    <p style="font-size: 14px; color: #6c757d; margin: 0 0 24px 0; line-height: 1.5;">
                      The latest Proceq sync produced <strong>${data.measured.length}</strong> measured and
                      <strong>${data.notMeasured.length}</strong> not-measured measurement(s).
                    </p>

                    <!-- Measured Data -->
                    <h3 style="font-size: 15px; color: #2c3e50; margin: 0 0 8px 0;">Measured Data (${data.measured.length})</h3>
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 0 24px 0; border: 1px solid #e9ecef; border-radius: 6px; border-collapse: collapse;">
                      ${tableHead}
                      <tbody>
                        ${buildRows(data.measured)}
                      </tbody>
                    </table>

                    <!-- Not Measured Data -->
                    <h3 style="font-size: 15px; color: #2c3e50; margin: 0 0 8px 0;">Not Measured Data (${data.notMeasured.length})</h3>
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0; border: 1px solid #e9ecef; border-radius: 6px; border-collapse: collapse;">
                      ${tableHead}
                      <tbody>
                        ${buildRows(data.notMeasured)}
                      </tbody>
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

  /**
   * Alert email sent when a Proceq measurement's status transitions to a new
   * value (Flow 2). One email is sent per Proceq record so recipients can act
   * on each Banshee independently.
   */
  public buildProceqStatusChangeTemplate(data: {
    serialNumber: string;
    bansheeName: string | null;
    measurementId: string;
    previousStatus: string;
    newStatus: string;
  }): string {
    const escape = (value: string): string =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const bansheeLabel = data.bansheeName
      ? `${escape(data.bansheeName)} (${escape(data.serialNumber)})`
      : escape(data.serialNumber);

    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Banshee Status Change Alert</title>
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
                    <p style="font-size: 16px; color: #6c757d; margin: 0;">Ground Support Platform</p>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="font-size: 20px; color: #2c3e50; margin: 0 0 16px 0;">Status change alert</h2>
                    <p style="margin: 0 0 24px 0; padding: 14px 18px; background: #fff4e5; border-left: 4px solid #f0932b; border-radius: 6px; font-size: 14px; color: #495057; line-height: 1.5;">
                      Banshee <strong>${bansheeLabel}</strong> with Measurement ID
                      <strong>${escape(data.measurementId)}</strong> changed from
                      <strong>${escape(data.previousStatus)}</strong> to
                      <strong>${escape(data.newStatus)}</strong>.
                    </p>

                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0; background-color: #f8f9fa; border-radius: 6px;">
                      <tr>
                        <td style="padding: 16px 20px;">
                          <p style="margin: 0 0 6px 0; font-size: 14px; color: #2c3e50;"><strong>Serial Number:</strong> ${escape(data.serialNumber)}</p>
                          <p style="margin: 0 0 6px 0; font-size: 14px; color: #2c3e50;"><strong>Measurement ID:</strong> ${escape(data.measurementId)}</p>
                          <p style="margin: 0 0 6px 0; font-size: 14px; color: #2c3e50;"><strong>Previous Status:</strong> ${escape(data.previousStatus)}</p>
                          <p style="margin: 0; font-size: 14px; color: #2c3e50;"><strong>Current Status:</strong> ${escape(data.newStatus)}</p>
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
}
