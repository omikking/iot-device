import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class UpdateBoltResultInput extends GraphQLTypes.UpdateBoltResultInput {
  @IsOptional()
  @IsNumber()
  boltNumber: number;

  @IsOptional()
  @Length(2, 35)
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
  comment: string;

  @IsOptional()
  @IsString()
  image: string;
}
