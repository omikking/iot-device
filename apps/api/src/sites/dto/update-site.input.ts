import { IsOptional, IsString, MaxLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateSiteInput extends GraphQLTypes.UpdateSiteInput {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  siteName: string;

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
}
