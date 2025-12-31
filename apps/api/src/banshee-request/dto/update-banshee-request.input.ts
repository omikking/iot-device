import { InputType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Upload } from 'graphql-upload-ts';
import * as GraphQLTypes from '../../graphql-types';

@InputType()
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

  @IsInt()
  @Min(1)
  @IsOptional()
  period?: number;

  @IsString()
  @IsOptional()
  locationDetails?: string;

  @IsOptional()
  boltInstallationDateTime?: GraphQLTypes.DateTime[];

  @IsString()
  @IsOptional()
  ringPosition?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsBoolean()
  @IsOptional()
  isBrokenBolt?: boolean;

  @IsBoolean()
  @IsOptional()
  isNotMeasurable?: boolean;

  @IsBoolean()
  @IsOptional()
  measured?: boolean;

  @IsOptional()
  images?: Upload[];
}
