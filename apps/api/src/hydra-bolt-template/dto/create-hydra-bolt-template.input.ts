import {
  IsString,
  IsOptional,
  IsUUID,
  IsObject,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateHydraBoltTemplateInputDto extends GraphQLTypes.CreateHydraBoltTemplateInput {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  siteId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  levelId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  driveId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  locationId?: string;

  @IsOptional()
  @IsObject()
  coordinates?: any;

  @IsString()
  @IsOptional()
  locationDetails?: string;

  @IsOptional()
  boltInstallationDateTime?: GraphQLTypes.DateTime;

  @IsOptional()
  @IsEnum(GraphQLTypes.RingPosition)
  ringPosition?: GraphQLTypes.RingPosition;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsBoolean()
  activateNotifications!: boolean;

  @IsString()
  @IsUUID()
  companyId!: string;
}
