import { ArrayMinSize, ArrayNotEmpty, IsArray, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateCompanyInput extends GraphQLTypes.CreateCompanyInput {
  @Length(2, 35)
  name: string;

  @Length(10)
  orgNumber: string;

  @Length(2, 95)
  address: string;

  @Length(5)
  postalCode: string;

  @Length(2, 35)
  city: string;

  @Length(2, 35)
  country: string;

  @Length(2, 35)
  companyContactEmail: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  userPermissions: GraphQLTypes.CreateUserPermissionInput[];
}
