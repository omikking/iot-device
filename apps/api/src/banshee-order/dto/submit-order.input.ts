import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class SubmitOrderInput {
  @IsUUID()
  companyId!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachmentsName?: string[];

  @IsString()
  comment!: string;
}
