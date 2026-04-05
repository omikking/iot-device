import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailTemplateService } from './email-template.service';
import { EmailSesService } from './email.ses-service';

@Module({
  providers: [EmailService, EmailTemplateService, EmailSesService],
  exports: [EmailService],
})
export class EmailModule {}
