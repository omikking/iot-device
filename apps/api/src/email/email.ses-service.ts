import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class EmailSesService {
  private sesClient: SESClient;

  constructor(private configService: ConfigService) {
    this.sesClient = new SESClient({
      region: this.configService.get('AWS_REGION'),
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ) {
    try {
      await this.sesClient.send(
        new SendEmailCommand({
          Source: `"Ground Support Platform" <${this.configService.get('SES_FROM')}>`,
          Destination: {
            ToAddresses: [to],
          },
          Message: {
            Subject: {
              Data: subject,
            },
            Body: {
              Text: {
                Data: text,
              },
              Html: {
                Data: html,
              },
            },
          },
        }),
      );

      console.log('Email sent via SES');
    } catch (error) {
      console.error('SES error:', error);
      throw error;
    }
  }
}