import { IsArray, IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { Application, Role } from '@prisma/client';
import * as GraphQLTypes from '../../graphql-types';

export class CreateInvitationInput extends GraphQLTypes.CreateInvitationInput {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsUUID(4, { message: 'Company ID must be a valid UUID' })
  companyId: string;

  @IsEnum(Role, { message: 'Invalid role' })
  role: Role;

  @IsArray()
  @IsEnum(Application, { each: true, message: 'Invalid application access' })
  appsAccess: Application[];
}
