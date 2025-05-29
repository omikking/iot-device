import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordResolver } from './reset-password.resolver';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [ResetPasswordResolver, ResetPasswordService],
})
export class ResetPasswordModule {}
