import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateOpticboltTestResultInput extends GraphQLTypes.CreateOpticboltTestResultInput {
  @IsString()
  serialNumber: string;

  @IsOptional()
  @IsString()
  drawingNumber?: string;

  @IsOptional()
  @IsString()
  boltType?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDate()
  testedAt: Date;

  @IsString()
  testedBy: string;

  @IsString()
  result: string;

  @IsOptional()
  @IsBoolean()
  fibreCheck1?: boolean;

  @IsOptional()
  @IsBoolean()
  fibreCheck2?: boolean;

  @IsOptional()
  @IsInt()
  psi20?: number;

  @IsOptional()
  @IsInt()
  psi100?: number;

  @IsInt()
  spectrumIndex: number;

  @IsOptional()
  @IsNumber()
  amplitude20?: number;

  @IsOptional()
  @IsNumber()
  wavelength20?: number;

  @IsOptional()
  @IsNumber()
  amplitude100?: number;

  @IsOptional()
  @IsNumber()
  wavelength100?: number;

  @IsOptional()
  @IsNumber()
  peakInitialNm?: number;

  @IsOptional()
  @IsNumber()
  peak20Nm?: number;

  @IsOptional()
  @IsNumber()
  peak100Nm?: number;

  @IsOptional()
  @IsNumber()
  strain20?: number;

  @IsOptional()
  @IsNumber()
  strain100?: number;

  @IsOptional()
  @IsNumber()
  load20?: number;

  @IsOptional()
  @IsNumber()
  load100?: number;

  @IsOptional()
  @IsInt()
  time20Ms?: number;

  @IsOptional()
  @IsInt()
  time100Ms?: number;

  @IsOptional()
  @IsNumber()
  calibrationFactor?: number;
}
