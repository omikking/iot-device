import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsString,
  Length,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateCompanyInput extends GraphQLTypes.CreateCompanyInput {
  @IsString()
  @Length(2, 35)
  name: string;

  @IsString()
  @Length(10)
  orgNumber: string;

  @IsString()
  @Length(2, 95)
  adress: string;

  @IsString()
  @Length(5) // @TODO Need to update in the future, might not be 5 in countries outside of SWE
  postalCode: string;

  @IsString()
  @Length(2, 35)
  city: string;

  @IsString()
  @Length(2, 35)
  country: string;

  @IsString()
  @IsEmail()
  companyContactEmail: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  userPermissions: GraphQLTypes.CreateUserPermissionInput[];

  @IsArray()
  plans: GraphQLTypes.CreatePlanInput[];
}
