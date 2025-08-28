import { IsString, IsUUID, MaxLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateSiteInput extends GraphQLTypes.CreateSiteInput {
  @IsString()
  @MaxLength(50)
  siteName: string;

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

  @IsUUID()
  companyId: string;
}
