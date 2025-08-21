import { IsEmail, IsEnum, IsString } from 'class-validator';
import { GlobalRole } from '@prisma/client';
import * as GraphQLTypes from '../../graphql-types';

export class CreateGlobalInvitationInput extends GraphQLTypes.CreateGlobalInvitationInput {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsEnum(GlobalRole, { message: 'Invalid global role' })
  globalRole: GlobalRole;
}
