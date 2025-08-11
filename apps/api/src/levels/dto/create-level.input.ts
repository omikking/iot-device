import { IsString, IsUUID, MaxLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateLevelInput extends GraphQLTypes.CreateLevelInput {
  @IsString()
  @MaxLength(50)
  levelName: string;

  @IsUUID()
  siteId: string;
}
