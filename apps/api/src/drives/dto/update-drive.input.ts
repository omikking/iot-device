import { IsOptional, IsString, MaxLength } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateDriveInput extends GraphQLTypes.UpdateDriveInput {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  driveName: string;
}
