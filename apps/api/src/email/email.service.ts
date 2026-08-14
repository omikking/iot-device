import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalRole, Role } from '@prisma/client';
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
      // Defaults to true. Set to "false" locally — smtp4dev doesn't support STARTTLS.
      requireTLS: this.configService.get('SMTP_REQUIRE_TLS') !== 'false',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  // ================================================================================
  // PUBLIC EMAIL SENDING METHODS
  // ================================================================================
  private getSesHeaders() {
    return {
      'X-SES-SOURCE-ARN': this.configService.get('SES_SOURCE_ARN'),
      'X-SES-FROM-ARN': this.configService.get('SES_FROM_ARN'),
      'X-SES-CONFIGURATION-SET': this.configService.get(
        'SES_CONFIGURATION_SET',
      ),
    };
  }
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

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: `You're invited to join ${companyName} as ${this.emailTemplateService.getRoleDisplayName(userRole)}`,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        ...this.getSesHeaders(),
      },
    });
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

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: `You're invited to join Ground Support Platform as ${roleDisplayName}`,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        ...this.getSesHeaders(),
      },
    });
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

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: `You have been assigned as ${roleDisplayName} for ${companyName} in Ground Support Platform`,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'Normal',
        ...this.getSesHeaders(),
      },
    });
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

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: `You have been assigned as ${roleDisplayName} in Ground Support Platform`,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'Normal',
        ...this.getSesHeaders(),
      },
    });
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

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: 'Password Reset - Ground Support Platform',
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        ...this.getSesHeaders(),
      },
    });
  }

  async sendSharePlotListEmail(
    email: string,
    companyName: string,
    sharedByUser: string,
    attachments: any[] = [],
  ) {
    const loginUrl = `${this.configService.get('FRONTEND_URL')}/api/auth/signin`;

    const htmlTemplate = this.emailTemplateService.buildSharePlotListTemplate(
      companyName,
      sharedByUser,
    );

    const textContent = `
Ground Support Platform

SANDVIK

A plot list has been shared with you.

Company: ${companyName}
Shared By: ${sharedByUser}

Sign in: ${loginUrl}

Need help? Contact your administrator for assistance.
`.trim();

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: `Plot List shared with you from ${companyName}`,
      text: textContent,
      html: htmlTemplate,
      attachments: attachments.map((file) => ({
        filename: file.originalFileName,
        path: file.filePath, // since you are storing locally
      })),
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'Normal',
        ...this.getSesHeaders(),
      },
    });
  }

  async sendContactUsEmail(
    companyName: string,
    message: string,
    sharedByUser: string,
    attachments: any[] = [],
    sandvikAdminEmail?: string,
  ) {
    const loginUrl = `${this.configService.get('FRONTEND_URL')}/api/auth/signin`;

    // Support recipients are configurable (comma-separated) so they can differ
    // per environment, falling back to the default Sandvik support inboxes.
    const supportRecipients = [
      ...new Set(
        ['xCell@sandvik.com', sandvikAdminEmail]
          .filter((emails): emails is string => Boolean(emails))
          .flatMap((emails) => emails.split(','))
          .map((email) => email.trim())
          .filter(Boolean),
      ),
    ];

    const htmlTemplate = this.emailTemplateService.buildContactUsTemplate(
      companyName,
      sharedByUser,
      message,
      attachments,
    );

    const textContent = `
Ground Support Platform

SANDVIK

New Contact Us request received.

Company: ${companyName}

Shared By User: ${sharedByUser}

Message:
${message || 'No message provided'}

Attachments: ${attachments.length}

Sign in: ${loginUrl}

Need help? Contact your administrator for assistance.
`.trim();

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: supportRecipients,
      subject: `New Contact Us request from ${companyName}`,
      text: textContent,
      html: htmlTemplate,
      attachments: attachments.map((file) => ({
        filename: file.originalFileName,
        path: file.filePath, // since you are storing locally
      })),
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'Normal',
        ...this.getSesHeaders(),
      },
    });
  }

  async sendOrderDetailsEmail(
    recipientEmails: string[],
    data: OrderDetailsEmailData,
    type: 'ORDER_SUBMITTED' | 'ORDER_REQUEST',
  ) {
    // Nothing to do if there are no recipients — avoid a pointless SMTP call
    // (and nodemailer throwing on an empty recipient list).
    if (recipientEmails.length === 0) {
      return;
    }
    const subject =
      type === 'ORDER_SUBMITTED'
        ? `Order Submitted - ${data.companyName}`
        : `Order Request - ${data.companyName}`;

    const loginUrl = `${this.configService.get('FRONTEND_URL')}/api/auth/signin`;

    const htmlTemplate =
      this.emailTemplateService.buildOrderDetailsTemplate(data);

    const itemsText = data.items.length
      ? data.items
          .map(
            (item, index) =>
              `  ${index + 1}. ${item.type} | ${item.label} | ${item.location} | Period: ${
                item.period ?? '-'
              } | ${item.status}`,
          )
          .join('\n')
      : '  None';

    const attachmentsText = data.attachmentNames.length
      ? data.attachmentNames.map((name) => `  - ${name}`).join('\n')
      : '  None';

    const textContent = `
Ground Support Platform

SANDVIK

A new Banshee order has been placed.

Company: ${data.companyName}
Order ID: ${data.orderId}
Status: ${data.status}
Placed By: ${data.sharedByUser}
Date: ${data.orderDate}

Message:
${data.message || 'No message provided'}

Order Items (${data.items.length}):
${itemsText}

Attachments (${data.attachmentNames.length}):
${attachmentsText}

Sign in: ${loginUrl}

Need help? Contact your administrator for assistance.
`.trim();

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      // Recipients go in BCC so company users don't see each other's
      // addresses; `to` is the platform sender to keep a valid envelope.
      to: this.configService.get('SMTP_FROM'),
      bcc: recipientEmails,
      subject,
      text: textContent,
      html: htmlTemplate,
      attachments: (data.files ?? []).map((file) => ({
        filename: file.originalFileName,
        content: file.content, // attached in-memory; never persisted to disk
      })),
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'Normal',
        ...this.getSesHeaders(),
      },
    });
  }

  // Proceq Flow 1: consolidated insights email summarising every measurement
  // received in a sync for a company — split into measured and not-measured.
  async sendProceqMeasurementInsightsEmail(
    recipientEmails: string[],
    data: ProceqMeasurementInsightsEmailData,
  ): Promise<void> {
    // Avoid a pointless SMTP call (nodemailer throws on an empty recipient list).
    if (recipientEmails.length === 0) {
      return;
    }

    const htmlTemplate =
      this.emailTemplateService.buildProceqMeasurementInsightsTemplate(data);

    const itemLine = (item: ProceqMeasurementSummaryItem): string => {
      const label = item.bansheeName
        ? `${item.bansheeName} (${item.serialNumber})`
        : item.serialNumber;
      return `  - ${label} | Measurement ${item.measurementId} | ${item.status}`;
    };

    const measuredText = data.measured.length
      ? data.measured.map(itemLine).join('\n')
      : '  None';

    const notMeasuredText = data.notMeasured.length
      ? data.notMeasured.map(itemLine).join('\n')
      : '  None';

    const textContent = `
Ground Support Platform

SANDVIK

Proceq measurement summary.

Measured Data (${data.measured.length}):
${measuredText}

Not Measured Data (${data.notMeasured.length}):
${notMeasuredText}

Need help? Contact your administrator for assistance.
`.trim();

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      // Recipients go in BCC so they don't see each other's addresses; `to` is
      // the platform sender to keep a valid envelope.
      to: this.configService.get('SMTP_FROM'),
      bcc: recipientEmails,
      subject: `Proceq measurement summary - ${data.measured.length} measured, ${data.notMeasured.length} not measured`,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'Normal',
        ...this.getSesHeaders(),
      },
    });
  }

  // Proceq Flow 2: alert email sent when a measurement's status changes.
  async sendProceqStatusChangeEmail(
    recipientEmails: string[],
    data: ProceqStatusChangeEmailData,
  ): Promise<void> {
    if (recipientEmails.length === 0) {
      return;
    }

    const htmlTemplate =
      this.emailTemplateService.buildProceqStatusChangeTemplate(data);

    const bansheeLabel = data.bansheeName
      ? `${data.bansheeName} (${data.serialNumber})`
      : data.serialNumber;

    const textContent = `
Ground Support Platform

SANDVIK

Banshee ${bansheeLabel} with Measurement ID ${data.measurementId} changed from ${data.previousStatus} to ${data.newStatus}.

Serial Number: ${data.serialNumber}
Measurement ID: ${data.measurementId}
Previous Status: ${data.previousStatus}
Current Status: ${data.newStatus}

Need help? Contact your administrator for assistance.
`.trim();

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: this.configService.get('SMTP_FROM'),
      bcc: recipientEmails,
      subject: `Status change alert - ${bansheeLabel}`,
      text: textContent,
      html: htmlTemplate,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        ...this.getSesHeaders(),
      },
    });
  }
}

/** A single measurement in the consolidated Flow 1 summary email. */
export interface ProceqMeasurementSummaryItem {
  serialNumber: string;
  bansheeName: string | null;
  measurementId: string;
  status: string;
}

export interface ProceqMeasurementInsightsEmailData {
  measured: ProceqMeasurementSummaryItem[];
  notMeasured: ProceqMeasurementSummaryItem[];
}

export interface ProceqStatusChangeEmailData {
  serialNumber: string;
  bansheeName: string | null;
  measurementId: string;
  previousStatus: string;
  newStatus: string;
}

export interface OrderDetailsEmailItem {
  type: string;
  label: string;
  location: string;
  period?: number | null;
  status: string;
}

export interface OrderDetailsEmailFile {
  originalFileName: string;
  /** Raw file bytes attached in-memory — order attachments are never persisted. */
  content: Buffer;
}

export interface OrderDetailsEmailData {
  orderId: string;
  status: string;
  orderDate: string;
  companyName: string;
  sharedByUser: string;
  message: string;
  /** File names shown in the email body. */
  attachmentNames: string[];
  /** Actual files attached to the email (in-memory buffers, not persisted). */
  files?: OrderDetailsEmailFile[];
  items: OrderDetailsEmailItem[];
}
