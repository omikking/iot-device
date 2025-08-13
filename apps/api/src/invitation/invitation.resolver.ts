import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InvitationService } from './invitation.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import * as GraphQLTypes from 'src/graphql-types';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class InvitationResolver {
  constructor(private invitationService: InvitationService) {}

  @Roles([Role.COMPANY_ADMIN], [], 'invitation')
  @Mutation('createInvitation')
  async createInvitation(
    @Args('input') input: GraphQLTypes.CreateInvitationInput,
  ) {
    return this.invitationService.createInvitation(
      input.email,
      input.companyId,
      input.role as any,
      input.appsAccess as any[],
    );
  }

  @Query('validateInvitation')
  async validateInvitation(@Args('token') token: string) {
    return this.invitationService.validateInvitation(token);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'invitation')
  @Query('pendingInvitations')
  async getPendingInvitations(@Args('companyId') companyId: string) {
    return this.invitationService.getPendingInvitations(companyId);
  }

  @Mutation('completeInvitation')
  async completeInvitation(
    @Args('input') input: GraphQLTypes.CompleteInvitationInput,
  ) {
    return this.invitationService.completeInvitation(input.token, {
      fullName: input.fullName,
      password: input.password,
      workPlace: input.workPlace,
      phoneNumber: input.phoneNumber || undefined,
    });
  }

  @Roles([Role.COMPANY_ADMIN], [], 'invitation')
  @Mutation('resendInvitation')
  async resendInvitation(@Args('id') id: string) {
    return this.invitationService.resendInvitation(id);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'invitation')
  @Mutation('removeInvitation')
  async removeInvitation(@Args('id') id: string) {
    return this.invitationService.removeInvitation(id);
  }
}
