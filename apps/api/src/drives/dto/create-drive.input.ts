import { IsString, IsUUID, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateDriveInput extends GraphQLTypes.CreateDriveInput {
  @IsString()
  @Length(2, 35)
  driveName: string;

  @IsUUID()
  levelId: string;
}
