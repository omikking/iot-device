import { IsString, IsUUID, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateLocationInput extends GraphQLTypes.CreateLocationInput {
  @IsString()
  @Length(2, 35)
  locationName: string;

  @IsUUID()
  driveId: string;
}
