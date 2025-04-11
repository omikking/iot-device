import { Field, ObjectType } from '@nestjs/graphql';

export enum RingListPositions {
  LH_Backs = 'LH_Backs',
  Center_Backs = 'Center_Backs',
  RH_Backs = 'RH_Backs',

  LH_Face_High = 'LH_Face_High',
  LH_Face_Low = 'LH_Face_Low',
  RH_Face_High = 'RH_Face_High',
  RH_Face_Low = 'RH_Face_Low',

  LH_Shoulder = 'LH_Shoulder',
  LH_Wall_Upper = 'LH_Wall_Upper',
  LH_Wall_Center = 'LH_Wall_Center',
  LH_Wall_Lower = 'LH_Wall_Lower',

  RH_Shoulder = 'RH_Shoulder',
  RH_Wall_Upper = 'RH_Wall_Upper',
  RH_Wall_Center = 'RH_Wall_Center',
  RH_Wall_Lower = 'RH_Wall_Lower',
}

export const RingListPositionLabels: Record<RingListPositions, string> = {
  [RingListPositions.LH_Backs]: 'L/H Backs',
  [RingListPositions.Center_Backs]: 'Center Backs',
  [RingListPositions.RH_Backs]: 'R/H Backs',

  [RingListPositions.LH_Face_High]: 'L/H Face High',
  [RingListPositions.LH_Face_Low]: 'L/H Face Low',
  [RingListPositions.RH_Face_High]: 'R/H Face High',
  [RingListPositions.RH_Face_Low]: 'R/H Face Low',

  [RingListPositions.LH_Shoulder]: 'L/H Shoulder',
  [RingListPositions.LH_Wall_Upper]: 'L/H Wall Upper',
  [RingListPositions.LH_Wall_Center]: 'L/H Wall Center',
  [RingListPositions.LH_Wall_Lower]: 'L/H Wall Lower',

  [RingListPositions.RH_Shoulder]: 'R/H Shoulder',
  [RingListPositions.RH_Wall_Upper]: 'R/H Wall Upper',
  [RingListPositions.RH_Wall_Center]: 'R/H Wall Center',
  [RingListPositions.RH_Wall_Lower]: 'R/H Wall Lower',
};

@ObjectType()
export class EnumOption {
  @Field()
  key: string;

  @Field()
  value: string;
}

export const getRingListPositionOptions = (): EnumOption[] => {
  return Object.entries(RingListPositionLabels).map(([key, value]) => ({
    key,
    value,
  }));
};
