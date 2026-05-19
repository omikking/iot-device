import { IsString, IsOptional, IsInt, Min, IsUUID } from 'class-validator';

export class UpdateNewBansheeCartItemInput {
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  name?: string;

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
}
