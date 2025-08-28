import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateCompanyInput extends GraphQLTypes.UpdateCompanyInput {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  orgNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  address: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  postalCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  country: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  companyContactEmail: string;

  @IsString()
  sandvikAdminUserId?: string;

  @IsOptional()
  @IsArray()
  plans: GraphQLTypes.UpdatePlanInput[];
}
