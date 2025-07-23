import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateUserInput extends GraphQLTypes.UpdateUserInput {
  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  workPlace: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  globalRole: string;

  @IsOptional()
  @IsBoolean()
  isGlobalVisibility: boolean;
}
