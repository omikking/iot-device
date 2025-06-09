import { IsOptional, IsString, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';
export class UpdatePasswordInput extends GraphQLTypes.UpdatePasswordInput {
  @IsOptional()
  @IsString()
  @Length(2, 35)
  oldPassword: string;

  @IsOptional()
  @IsString()
  @Length(2, 35)
  newPassword: string;

  @IsOptional()
  @IsString()
  @Length(2, 35)
  confirmPassword: string;
}
