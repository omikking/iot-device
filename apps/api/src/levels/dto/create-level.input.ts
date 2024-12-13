import { IsString, IsUUID, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateLevelInput extends GraphQLTypes.CreateLevelInput {
  @IsString()
  @Length(2, 35)
  levelName: string;

  @IsUUID()
  siteId: string;
}
