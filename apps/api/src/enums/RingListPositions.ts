import { RingPosition } from '@prisma/client';

export const RingListPositionLabels: Record<RingPosition, string> = {
  [RingPosition.LH_BACKS]: 'L/H Backs',
  [RingPosition.CENTER_BACKS]: 'Center Backs',
  [RingPosition.RH_BACKS]: 'R/H Backs',

  [RingPosition.LH_FACE_HIGH]: 'L/H Face High',
  [RingPosition.LH_FACE_LOW]: 'L/H Face Low',
  [RingPosition.RH_FACE_HIGH]: 'R/H Face High',
  [RingPosition.RH_FACE_LOW]: 'R/H Face Low',

  [RingPosition.LH_SHOULDER]: 'L/H Shoulder',
  [RingPosition.LH_WALL_UPPER]: 'L/H Wall Upper',
  [RingPosition.LH_WALL_CENTER]: 'L/H Wall Center',
  [RingPosition.LH_WALL_LOWER]: 'L/H Wall Lower',

  [RingPosition.RH_SHOULDER]: 'R/H Shoulder',
  [RingPosition.RH_WALL_UPPER]: 'R/H Wall Upper',
  [RingPosition.RH_WALL_CENTER]: 'R/H Wall Center',
  [RingPosition.RH_WALL_LOWER]: 'R/H Wall Lower',
};

export const getRingListPositionOptions = () => {
  return Object.entries(RingListPositionLabels).map(([key, value]) => ({
    key: key as RingPosition,
    value,
  }));
};
