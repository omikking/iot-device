import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InvitationService } from './invitation.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  CreateInvitationInput,
  CreateGlobalInvitationInput,
  CompleteInvitationInput,
} from './dto';

@Resolver()
export class InvitationResolver {
  constructor(private invitationService: InvitationService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles([Role.COMPANY_ADMIN], [], 'invitation')
  @Mutation('createInvitation')
  async createInvitation(@Args('input') input: CreateInvitationInput) {
    return this.invitationService.createInvitation(
      input.email,
      input.companyId,
      input.role,
      input.appsAccess,
    );
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles([Role.SANDVIK_ADMIN], [], '')
  @Mutation('createGlobalInvitation')
  async createGlobalInvitation(
    @Args('input') input: CreateGlobalInvitationInput,
  ) {
    return this.invitationService.createGlobalInvitation(
      input.email,
      input.globalRole,
      input.isGlobalVisibility || false,
    );
  }

  @Query('validateInvitation')
  async validateInvitation(
    @Args('id') id: string,
    @Args('token') token: string,
  ) {
    return this.invitationService.validateInvitation(id, token);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles([Role.COMPANY_ADMIN], [], 'invitation')
  @Query('pendingInvitations')
  async getPendingInvitations(@Args('companyId') companyId: string) {
    return this.invitationService.getPendingInvitations(companyId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles([Role.SANDVIK_ADMIN], [], '')
  @Query('pendingGlobalInvitations')
  async getPendingGlobalInvitations() {
    return this.invitationService.getPendingGlobalInvitations();
  }

  @Mutation('completeInvitation')
  async completeInvitation(@Args('input') input: CompleteInvitationInput) {
    return this.invitationService.completeInvitation(input.id, input.token, {
      fullName: input.fullName,
      password: input.password,
      workPlace: input.workPlace,
      phoneNumber: input.phoneNumber || undefined,
    });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles([Role.COMPANY_ADMIN], [], 'invitation')
  @Mutation('resendInvitation')
  async resendInvitation(@Args('id') id: string) {
    return this.invitationService.resendInvitation(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles([Role.COMPANY_ADMIN], [], 'invitation')
  @Mutation('removeInvitation')
  async removeInvitation(@Args('id') id: string) {
    return this.invitationService.removeInvitation(id);
  }
}
