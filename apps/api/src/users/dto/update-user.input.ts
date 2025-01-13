import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateUserInput extends GraphQLTypes.UpdateUserInput {
  @IsOptional()
  @IsEmail()
  @Length(2, 35)
  email: string;

  @IsOptional()
  @IsString()
  @Length(2, 95)
  fullName: string;

  @IsOptional()
  @IsString()
  @Length(2, 35)
  workPlace: string;

  @IsOptional()
  @IsString()
  @Length(10, 13)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @Length(2, 35)
  globalRole: string;

  @IsOptional()
  @IsBoolean()
  isGlobalVisibility: boolean;
}
