import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { BansheeCartItemType } from '@prisma/client';

export class AddCartItemInput {
  @IsEnum(BansheeCartItemType)
  itemType!: BansheeCartItemType;

  @IsUUID()
  @IsOptional()
  bansheeRequestId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

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

  @IsInt()
  @IsOptional()
  period?: number;

  @IsUUID()
  companyId!: string;
}
