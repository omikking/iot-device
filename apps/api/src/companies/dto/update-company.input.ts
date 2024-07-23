import { IsOptional, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateCompanyInput extends GraphQLTypes.UpdateCompanyInput {
  @IsOptional()
  @Length(2, 35)
  name: string;

  @IsOptional()
  @Length(2, 35)
  country: string;

  @IsOptional()
  @Length(2, 35)
  city: string;

  @IsOptional()
  @Length(2, 95)
  address: string;
}
