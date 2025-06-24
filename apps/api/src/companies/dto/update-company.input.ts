import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateCompanyInput extends GraphQLTypes.UpdateCompanyInput {
  @IsOptional()
  @IsString()
  @Length(2, 35)
  name: string;

  @IsOptional()
  @IsString()
  @Length(10)
  orgNumber: string;

  @IsOptional()
  @IsString()
  @Length(2, 95)
  address: string;

  @IsOptional()
  @IsString()
  @Length(5)
  postalCode: string;

  @IsOptional()
  @IsString()
  @Length(2, 35)
  city: string;

  @IsOptional()
  @IsString()
  @Length(2, 35)
  country: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  companyContactEmail: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  userPermissions: GraphQLTypes.UpdateUserPermissionInput[]; // ✅ updated

  @IsOptional()
  @IsArray()
  plans: GraphQLTypes.UpdatePlanInput[];
}
