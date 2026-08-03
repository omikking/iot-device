import {
  IsString,
  IsOptional,
  IsUUID,
  IsObject,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateBansheeRequestInput extends GraphQLTypes.CreateBansheeRequestInput {
  @IsString()
  serialNumber!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsUUID()
  siteId!: string;

  @IsString()
  @IsUUID()
  levelId!: string;

  @IsString()
  @IsUUID()
  driveId!: string;

  @IsString()
  @IsUUID()
  locationId!: string;

  @IsOptional()
  @IsObject()
  coordinates?: any;

  @IsString()
  @IsOptional()
  locationDetails?: string;

  @IsOptional()
  boltInstallationDateTime?: GraphQLTypes.DateTime;

  @IsEnum(GraphQLTypes.RingPosition)
  ringPosition!: GraphQLTypes.RingPosition;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsBoolean()
  activateNotifications!: boolean;

  @IsString()
  boltType!: string;

  @IsString()
  @IsUUID()
  companyId!: string;
}
