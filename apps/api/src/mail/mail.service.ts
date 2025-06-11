import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    const baseUrl =
      this.configService.get<string>('BASE_URL') ||
      'http://localhost:3333/graphql';

    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Welcome to Ground Support Platform',
        template: 'welcome',
        context: {
          username,
          baseUrl,
          email: to,
        },
      });
      console.log('✅ Email sent to:', to);
    } catch (err) {
      console.error('❌ Email sending failed:', err);
    }
  }
}
