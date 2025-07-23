import { IsOptional, IsString, MaxLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateLocationInput extends GraphQLTypes.UpdateLocationInput {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  locationName: string;
}
