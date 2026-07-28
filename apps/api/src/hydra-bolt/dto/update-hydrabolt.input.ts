import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateHydraboltInput extends GraphQLTypes.UpdateHydraboltInput {
  @IsOptional()
  @IsString()
  partNumber?: string;

  @IsOptional()
  @IsString()
  drawingNumber?: string;

  @IsOptional()
  @IsNumber()
  boltLength?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  numberOfFBG?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  positionOfFBGs?: number[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  initialWavelength?: number[];

  @IsOptional()
  @IsNumber()
  elasticLimit?: number;

  @IsOptional()
  @IsNumber()
  lowPlasticLimit?: number;

  @IsOptional()
  @IsNumber()
  highPlasticLimit?: number;

  @IsOptional()
  @IsNumber()
  maxCalibrationFactor?: number;

  @IsOptional()
  @IsNumber()
  minCalibrationFactor?: number;
}
