import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  IsUUID,
  IsObject,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';
import { Upload } from 'graphql-upload-ts';

export class CreateBansheeRequestInput
  extends GraphQLTypes.CreateBansheeRequestInput
{
  @IsUUID()
  @IsOptional()
  bansheeOrderItemId!: string;

  @IsString()
  serialNumber!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  levelId!: string;

  @IsUUID()
  driveId!: string;

  @IsUUID()
  locationId!: string;

  @IsOptional()
  @IsObject()
  coordinates?: any;

  @IsInt()
  @Min(1)
  period!: number;

  @IsString()
  @IsOptional()
  locationDetails?: string;

  @IsOptional()
  boltInstallationDateTime?: GraphQLTypes.DateTime;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsBoolean()
  isBrokenBolt!: boolean;

  @IsBoolean()
  isNotMeasurable!: boolean;

  @IsBoolean()
  @IsOptional()
  measured?: boolean;

  @IsOptional()
  images?: Upload[];

  @IsString()
  boltType!: string;

  @IsString()
  @IsUUID()
  companyId!: string;

  @IsString()
  @IsUUID()
  siteId!: string;
}
