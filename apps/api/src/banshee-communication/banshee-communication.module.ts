import { Module } from '@nestjs/common';
import { BansheeCommunicationResolver } from './banshee-communication.resolver';
import { BansheeCommunicationService } from './banshee-communication.service';
import { BansheeAttachmentCleanupService } from './banshee-attachment-cleanup.service';
import { PdfReportService } from './pdf-report.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  providers: [
    BansheeCommunicationResolver,
    BansheeCommunicationService,
    BansheeAttachmentCleanupService,
    PdfReportService,
  ],
  exports: [BansheeCommunicationService],
})
export class BansheeCommmunicationModule {}
