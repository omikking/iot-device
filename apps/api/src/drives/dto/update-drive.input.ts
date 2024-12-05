import { IsOptional, IsString, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateDriveInput extends GraphQLTypes.UpdateDriveInput {
  @IsOptional()
  @IsString()
  @Length(2, 35)
  driveName: string;
}
