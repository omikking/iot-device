import { IsEmail, IsEnum, IsString } from 'class-validator';
import { GlobalRole } from '@prisma/client';
import * as GraphQLTypes from '../../graphql-types';

export class CreateGlobalInvitationInput extends GraphQLTypes.CreateGlobalInvitationInput {
  @IsString()
  @IsEmail()
  email: string;

  @IsEnum(GlobalRole)
  globalRole: GlobalRole;
}
