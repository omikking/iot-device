import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  IsUUID,
  IsObject,
} from 'class-validator';
import { Upload } from 'graphql-upload-ts';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateBansheeRequestInput extends GraphQLTypes.UpdateBansheeRequestInput {
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  levelId?: string;

  @IsUUID()
  @IsOptional()
  driveId?: string;

  @IsUUID()
  @IsOptional()
  locationId?: string;

  @IsOptional()
  @IsObject()
  coordinates?: any;

  @IsInt()
  @Min(1)
  @IsOptional()
  period?: number;

  @IsString()
  @IsOptional()
  locationDetails?: string;

  @IsOptional()
  boltInstallationDateTime?: GraphQLTypes.DateTime;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsBoolean()
  @IsOptional()
  isBrokenBolt?: boolean;

  @IsBoolean()
  @IsOptional()
  activateNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  isNotMeasurable?: boolean;

  @IsBoolean()
  @IsOptional()
  measured?: boolean;

  @IsOptional()
  images?: Upload[];

  @IsString()
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  siteId?: string;

  // null detaches the template; @IsOptional() skips validation for null/undefined.
  @IsUUID()
  @IsOptional()
  templateId?: string;
}
