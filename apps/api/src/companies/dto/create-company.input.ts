import { IsArray, IsEmail, IsString, MaxLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateCompanyInput extends GraphQLTypes.CreateCompanyInput {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(50)
  orgNumber: string;

  @IsString()
  @MaxLength(50)
  address: string;

  @IsString()
  @MaxLength(50)
  postalCode: string;

  @IsString()
  @MaxLength(50)
  city: string;

  @IsString()
  @MaxLength(50)
  country: string;

  @IsEmail()
  @MaxLength(50)
  companyContactEmail: string;

  @IsString()
  sandvikAdminUserId: string;

  @IsArray()
  plans: GraphQLTypes.CreatePlanInput[];
}
