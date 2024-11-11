import { Length } from 'class-validator';
import * as GraphQLTypes from '../../graphql-types';
import { AbortReason, Result } from '@prisma/client';

export class CreateBoltResultInput extends GraphQLTypes.CreateBoltResultInput {
  @Length(2, 35)
  boltNumber: number;

  @Length(2, 35)
  boltType: string;

  @Length(2, 35)
  peakLoad: number[];

  @Length(2, 35)
  peakDisplacement: number[];

  @Length(2, 35)
  positionInRing: string;

  @Length(2, 35)
  result: Result;

  isHazard: boolean;

  @Length(2, 35)
  hazardCompletedDate: Date[];

  @Length(2, 35)
  abortReason: AbortReason;

  @Length(2, 800)
  comment: string;

  @Length(2, 800)
  image: string;
}
