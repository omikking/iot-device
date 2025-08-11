import { IsOptional, IsString, MaxLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateLevelInput extends GraphQLTypes.UpdateLevelInput {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  levelName: string;
}
