import { IsOptional, IsString, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateLocationInput extends GraphQLTypes.UpdateLocationInput {
  @IsOptional()
  @IsString()
  @Length(2, 35)
  locationName: string;
}
