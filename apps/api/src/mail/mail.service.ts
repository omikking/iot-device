import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendWelcomeEmail(
    to: string,
    username: string,
  ): Promise<{ success: boolean; message: string }> {
    const baseUrl = this.configService.get<string>('BASE_URL');

    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Welcome to Ground Support Platform',
        template: './welcome',
        context: {
          username,
          baseUrl,
          email: to,
          logoCid: 'sandviklogo',
        },
        attachments: [
          {
            filename: 'sandvik_icon.jpg',
            path: join(__dirname, '..', 'assets', 'images', 'sandvik_icon.jpg'),
            cid: 'sandviklogo',
          },
        ],
      });

      return {
        success: true,
        message: `Email successfully delivered to ${to}.`,
      };
    } catch (err) {
      console.error('❌ Email sending failed:', err);

      return {
        success: false,
        message: `Failed to send welcome email to ${to}.`,
      };
    }
  }
}
