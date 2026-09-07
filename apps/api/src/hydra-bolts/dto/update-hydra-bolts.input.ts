import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsObject,
  IsEnum,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateHydraBoltInput extends GraphQLTypes.UpdateHydraBoltInput {
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
  @IsUUID()
  companyId!: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  templateId?: string;
}
