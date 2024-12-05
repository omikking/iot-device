import { IsString, IsUUID, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreatePositionInRingInput extends GraphQLTypes.CreatePositionInRingInput {
  @IsString()
  @Length(2, 35)
  positionInRingName: string;

  @IsUUID()
  driveId: string;
}
