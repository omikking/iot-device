import { IsString, IsUUID, MaxLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateLocationInput extends GraphQLTypes.CreateLocationInput {
  @IsString()
  @MaxLength(50)
  locationName: string;

  @IsUUID()
  driveId: string;
}
