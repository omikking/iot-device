import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InvitationService } from './invitation.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import * as GraphQLTypes from 'src/graphql-types';

@Resolver('Invitation')
export class InvitationResolver {
  constructor(private invitationService: InvitationService) {}

  @Mutation('createInvitation')
  @UseGuards(JwtGuard)
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

  @Mutation('completeInvitation')
  async completeInvitation(
    @Args('input') input: GraphQLTypes.CompleteInvitationInput,
  ) {
    return this.invitationService.completeInvitation(input.token, {
      fullName: input.fullName,
      password: input.password,
      workPlace: input.workPlace,
      phoneNumber: input.phoneNumber,
    });
  }
}
