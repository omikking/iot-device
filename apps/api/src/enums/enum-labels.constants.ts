import { PullTestAbortReason, RingPosition } from '@prisma/client';

export const PULL_TEST_ABORT_REASON_LABELS: Record<
  PullTestAbortReason,
  string
> = {
  [PullTestAbortReason.NOT_TESTED_VOID_CAVITY]:
    'Bolt not tested due to void or cavity',
  [PullTestAbortReason.TEST_STOPPED_INSTALL_ANGLE]:
    'Test stopped due to incorrect installation angle',
  [PullTestAbortReason.PEG_NOT_EXTRUDED]:
    'Bolt has not been installed correctly, peg not extruded',
  [PullTestAbortReason.HIGH_ANGLE_NOT_PERPENDICULAR]:
    'Bolt installed at a high angle, not perpendicular to the rock face',
  [PullTestAbortReason.REBAR_EJECTED_STOPPER_CAUGHT]:
    'Rebar ejected from bolt, visually popped, stopper has caught the bar',
  [PullTestAbortReason.BOLT_END_DAMAGE_RIG_NOT_ENGAGING]:
    'End of the bolt damaged, rig not engaging the rock plate properly',
  [PullTestAbortReason.PULL_TEST_COLLAR_INSTALLED_BACKWARDS]:
    'Pull test collar installed backwards',
  [PullTestAbortReason.BROKEN_BOLT_NUT]: 'Broken bolt nut',
};

export const RING_POSITION_LABELS: Record<RingPosition, string> = {
  [RingPosition.RH_BACKS]: 'RH Backs',
  [RingPosition.RH_SHOULDER]: 'RH Shoulder',
  [RingPosition.RH_WALL_UPPER]: 'RH Wall Upper',
  [RingPosition.RH_WALL_CENTER]: 'RH Wall Center',
  [RingPosition.RH_WALL_LOWER]: 'RH Wall Lower',
  [RingPosition.RH_FACE_HIGH]: 'RH Face High',
  [RingPosition.RH_FACE_LOW]: 'RH Face Low',
  [RingPosition.LH_BACKS]: 'LH Backs',
  [RingPosition.LH_SHOULDER]: 'LH Shoulder',
  [RingPosition.LH_WALL_UPPER]: 'LH Wall Upper',
  [RingPosition.LH_WALL_CENTER]: 'LH Wall Center',
  [RingPosition.LH_WALL_LOWER]: 'LH Wall Lower',
  [RingPosition.LH_FACE_HIGH]: 'LH Face High',
  [RingPosition.LH_FACE_LOW]: 'LH Face Low',
  [RingPosition.CENTER_BACKS]: 'Center Backs',
};
