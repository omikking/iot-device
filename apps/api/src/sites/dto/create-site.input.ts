import { IsString, IsUUID, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateSiteInput extends GraphQLTypes.CreateSiteInput {
  @IsString()
  @Length(2, 35)
  siteName: string;

  @IsString()
  @Length(2, 95)
  address: string;

  @IsString()
  @Length(5) // @TODO Need to update in the future, might not be 5 in countries outside of SWE
  postalCode: string;

  @IsString()
  @Length(2, 35)
  city: string;

  @IsString()
  @Length(2, 35)
  country: string;

  @IsUUID()
  companyId: string;
}
