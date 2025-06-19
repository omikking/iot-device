import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateUserPermissionInput extends GraphQLTypes.CreateUserPermissionInput {
  @IsEmail()
  userEmail: string;

  @IsString()
  @Length(2, 35)
  role: string;

  @IsArray()
  @ArrayNotEmpty()
  appsAccess: string[];

  @IsUUID()
  companyId: string;
}
