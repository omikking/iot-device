import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateUserPermissionInput extends GraphQLTypes.UpdateUserPermissionInput {
  @IsOptional()
  @IsString()
  @Length(2, 35)
  role: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  appsAccess: string[];
}
