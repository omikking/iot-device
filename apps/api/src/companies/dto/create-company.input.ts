import { Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateCompanyInput extends GraphQLTypes.CreateCompanyInput {
  @Length(2, 35)
  name: string;

  @Length(2, 35)
  country: string;

  @Length(2, 35)
  city: string;

  @Length(2, 95)
  address: string;
}
