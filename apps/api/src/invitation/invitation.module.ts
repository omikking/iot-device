import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationResolver } from './invitation.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  providers: [InvitationService, InvitationResolver, PrismaService],
  exports: [InvitationService],
})
export class InvitationModule {}
