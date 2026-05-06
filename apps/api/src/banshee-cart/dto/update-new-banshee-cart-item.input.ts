import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateNewBansheeCartItemInput {
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsOptional()
  period?: number;
}
