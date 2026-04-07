import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';
import { Upload } from 'graphql-upload-ts';

export class CreateBoltResultInput extends GraphQLTypes.CreateBoltResultInput {
  @IsNumber()
  boltNumber: number;

  @MaxLength(50)
  @IsString()
  boltType: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  peakLoad: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
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
  image: Upload;

  @IsDate()
  measuredAt: Date;

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
