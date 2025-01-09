import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';

export class CreateBoltResultInput extends GraphQLTypes.CreateBoltResultInput {
  @IsNumber()
  boltNumber: number;

  @Length(2, 35)
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

  @Length(2, 35)
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
