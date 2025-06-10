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

    // const encodedEmail = encodeURIComponent(to);
    // console.log(encodedEmail, 'encodedEmail');

    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to Ground Support Platform',
      template: 'welcome', // refers to welcome.hbs
      context: {
        username,
        baseUrl,
        email: to,
      },
    });
  }
}
