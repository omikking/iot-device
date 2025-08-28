import { IsOptional, IsString, MaxLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';
export class UpdatePasswordInput extends GraphQLTypes.UpdatePasswordInput {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  oldPassword: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  newPassword: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  confirmPassword: string;
}
