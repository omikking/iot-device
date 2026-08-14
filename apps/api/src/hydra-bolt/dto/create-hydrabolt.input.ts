import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateHydraboltInput extends GraphQLTypes.CreateHydraboltInput {
  @IsString()
  @IsNotEmpty()
  partNumber: string;

  @IsOptional()
  @IsString()
  drawingNumber?: string;

  @IsNumber()
  boltLength: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  numberOfFBG: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  positionOfFBGs: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  initialWavelength: number[];

  @IsNumber()
  elasticLimit: number;

  @IsNumber()
  lowPlasticLimit: number;

  @IsNumber()
  highPlasticLimit: number;

  @IsNumber()
  maxCalibrationFactor: number;

  @IsNumber()
  minCalibrationFactor: number;
}
