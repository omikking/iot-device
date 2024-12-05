import { IsOptional, IsString, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdatePositionInRingInput extends GraphQLTypes.UpdatePositionInRingInput {
  @IsOptional()
  @IsString()
  @Length(2, 35)
  positionInRingName: string;
}
