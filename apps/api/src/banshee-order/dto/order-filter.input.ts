import { IsOptional, IsString, IsEnum } from 'class-validator';
import { BansheeOrderStatus } from '@prisma/client';

export class OrderFilterInput {
  @IsEnum(BansheeOrderStatus)
  @IsOptional()
  status?: BansheeOrderStatus;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;
}
