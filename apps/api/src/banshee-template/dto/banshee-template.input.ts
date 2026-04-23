import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class BansheeTemplateInputDto extends GraphQLTypes.BansheeTemplateInput {
  @IsString()
  templateName!: string;

  @IsInt()
  @IsOptional()
  period?: number;

  @IsOptional()
  boltInstallationDateTime?: GraphQLTypes.DateTime;

  @IsUUID()
  @IsOptional()
  siteId?: string;

  @IsUUID()
  @IsOptional()
  levelId?: string;

  @IsUUID()
  @IsOptional()
  driveId?: string;

  @IsUUID()
  @IsOptional()
  locationId?: string;

  @IsString()
  @IsOptional()
  locationDetails?: string;

  @IsOptional()
  coordinates?: any;

  @IsOptional()
  activateNotifications?: boolean;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsUUID()
  companyId!: string;

  @IsOptional()
  ringPosition?: GraphQLTypes.RingPosition | null;
}
