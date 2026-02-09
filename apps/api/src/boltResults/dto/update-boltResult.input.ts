import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';
import { Upload } from 'graphql-upload-ts';

export class UpdateBoltResultInput extends GraphQLTypes.UpdateBoltResultInput {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsNumber()
  boltNumber: number;

  @IsOptional()
  @IsString()
  boltType: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  peakLoad: number[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  peakDisplacement: number[];

  @IsOptional()
  @IsString()
  positionInRing: string;

  @IsOptional()
  @IsString()
  result: string;

  @IsOptional()
  @IsBoolean()
  isHazard: boolean;

  @IsOptional()
  @IsArray()
  hazardCompletedDate: GraphQLTypes.DateTime[];

  @IsOptional()
  @IsString()
  abortReason: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment: string;

  @IsOptional()
  image: Upload;

  @IsOptional()
  @IsDate()
  measuredAt?: Date;
}
