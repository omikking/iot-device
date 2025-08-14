import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  async sendInvitationEmail(email: string, token: string, companyName: string) {
    const inviteUrl = `${this.configService.get('FRONTEND_URL')}/complete-signup?token=${token}`;

    await this.transporter.sendMail({
      from: `"Ground Support Platform" <${this.configService.get('SMTP_FROM')}>`,
      to: email,
      subject: 'You have been invited to Ground Support Platform',
      html: `
        <p>You have been invited to join ${companyName} on Ground Support Platform.</p>
        <p>Click the link below to complete your registration:</p>
        <p><a href="${inviteUrl}">Complete your registration</a></p>
        <p>This link will expire in 48 hours.</p>
      `,
    });
  }
}
