import { IsArray, IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { Application, Role } from '@prisma/client';
import * as GraphQLTypes from '../../graphql-types';

export class CreateInvitationInput extends GraphQLTypes.CreateInvitationInput {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsUUID(4)
  companyId: string;

  @IsEnum(Role)
  role: Role;

  @IsArray()
  @IsEnum(Application, { each: true })
  appsAccess: Application[];
}
