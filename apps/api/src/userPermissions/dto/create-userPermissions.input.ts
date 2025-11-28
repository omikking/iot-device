import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateUserPermissionInput
  extends GraphQLTypes.CreateUserPermissionInput
{
  @IsEmail()
  @MaxLength(50)
  userEmail: string;

  @IsString()
  @MaxLength(50)
  role: string;

  @IsArray()
  @ArrayNotEmpty()
  appsAccess: string[];

  @IsUUID()
  companyId: string;
}
