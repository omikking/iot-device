import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateBoltResultInput extends GraphQLTypes.UpdateBoltResultInput {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsNumber()
  @MaxLength(50)
  boltNumber: number;

  @IsOptional()
  @MaxLength(50)
  @IsString()
  boltType: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @MaxLength(50)
  peakLoad: number[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @MaxLength(50)
  peakDisplacement: number[];

  @IsOptional()
  @MaxLength(50)
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
  @IsString()
  image: string;
}
