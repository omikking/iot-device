import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordResolver } from './reset-password.resolver';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [ResetPasswordResolver, ResetPasswordService],
})
export class ResetPasswordModule {}
