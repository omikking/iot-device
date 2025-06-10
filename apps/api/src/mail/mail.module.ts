// src/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailResolver } from './mail.resolver';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const user = config.get<string>('MAIL_USER');
        const pass = config.get<string>('MAIL_PASS');

        console.log('✅ MAIL_USER:', user);
        console.log('✅ MAIL_PASS:', pass ? '******' : '❌ Missing');

        return {
          transport: {
            service: 'gmail',
            auth: {
              user,
              pass,
            },
          },
          defaults: {
            from: `"No Reply" <${config.get('MAIL_FROM')}>`,
          },
          template: {
            dir: join(process.cwd(), 'src', 'mail', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
  ],
  providers: [MailService, MailResolver],
  exports: [MailService],
})
export class MailModule {}
