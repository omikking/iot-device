import { IsOptional, IsString, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateSiteInput extends GraphQLTypes.UpdateSiteInput {
  @IsOptional()
  @IsString()
  @Length(2, 35)
  siteName: string;

  @IsOptional()
  @IsString()
  @Length(2, 95)
  adress: string;

  @IsOptional()
  @IsString()
  @Length(5) // @TODO Need to update in the future, might not be 5 in countries outside of SWE
  postalCode: string;

  @IsOptional()
  @IsString()
  @Length(2, 35)
  city: string;

  @IsOptional()
  @IsString()
  @Length(2, 35)
  country: string;
}
