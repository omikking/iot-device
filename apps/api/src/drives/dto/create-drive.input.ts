import { IsString, IsUUID, MaxLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateDriveInput extends GraphQLTypes.CreateDriveInput {
  @IsString()
  @MaxLength(50)
  driveName: string;

  @IsUUID()
  levelId: string;
}
