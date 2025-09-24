import { IsEmail, IsEnum, MaxLength } from 'class-validator';
import { GlobalRole } from '@prisma/client';
import * as GraphQLTypes from '../../graphql-types';

export class CreateGlobalInvitationInput extends GraphQLTypes.CreateGlobalInvitationInput {
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsEnum(GlobalRole)
  globalRole: GlobalRole;
}
