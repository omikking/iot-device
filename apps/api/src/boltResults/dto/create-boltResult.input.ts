import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateBoltResultInput extends GraphQLTypes.CreateBoltResultInput {
  @IsNumber()
  @MaxLength(50)
  boltNumber: number;

  @MaxLength(50)
  @IsString()
  boltType: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @MaxLength(50)
  peakLoad: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @MaxLength(50)
  peakDisplacement: number[];

  @IsString()
  positionInRing: string;

  @IsString()
  result: string;

  @IsBoolean()
  isHazard: boolean;

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

  @IsUUID()
  siteId: string;

  @IsUUID()
  levelId: string;

  @IsUUID()
  driveId: string;

  @IsUUID()
  locationId: string;

  @IsUUID()
  userId: string;
}
