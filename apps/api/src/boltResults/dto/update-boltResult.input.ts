import { IsOptional, Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';
import { AbortReason, Result } from '@prisma/client';

export class UpdateBoltResultInput extends GraphQLTypes.UpdateBoltResultInput {
  @IsOptional()
  @Length(2, 35)
  boltNumber: number;

  @IsOptional()
  @Length(2, 35)
  boltType: string;

  @IsOptional()
  @Length(2, 35)
  peakLoad: number[];

  @IsOptional()
  @Length(2, 35)
  peakDisplacement: number[];

  @IsOptional()
  @Length(2, 35)
  positionInRing: string;

  @IsOptional()
  @Length(2, 35)
  result: Result;

  @IsOptional()
  isHazard: boolean;

  @IsOptional()
  @Length(2, 35)
  hazardCompletedDate: Date[];

  @IsOptional()
  @Length(2, 35)
  abortReason: AbortReason;

  @IsOptional()
  @Length(2, 800)
  comment: string;

  @IsOptional()
  @Length(2, 800)
  image: string;
}
