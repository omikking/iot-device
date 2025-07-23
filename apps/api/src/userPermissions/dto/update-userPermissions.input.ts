import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateUserPermissionInput extends GraphQLTypes.UpdateUserPermissionInput {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  role: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  appsAccess: string[];
}
