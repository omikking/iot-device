import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationResolver } from './invitation.resolver';

@Module({
  providers: [InvitationService, InvitationResolver]
})
export class InvitationModule {}
