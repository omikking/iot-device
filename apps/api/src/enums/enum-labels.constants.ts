import { BoltType, PullTestAbortReason, RingPosition } from '@prisma/client';

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

export const BOLT_TYPE_LABELS: Record<BoltType, string> = {
  [BoltType.D47_MD_1_8_M]: 'D47 MD - 1.8 m',
  [BoltType.D47_MD_2_1_M]: 'D47 MD - 2.1 m',
  [BoltType.D47_MD_2_4_M]: 'D47 MD - 2.4 m',
  [BoltType.D47_MD_3_0_M]: 'D47 MD - 3.0 m',
  [BoltType.D47_MD_3_8_M]: 'D47 MD - 3.8 m',
  [BoltType.D47_MDX_1_8_M]: 'D47 MDX - 1.8 m',
  [BoltType.D47_MDX_2_1_M]: 'D47 MDX - 2.1 m',
  [BoltType.D47_MDX_2_4_M]: 'D47 MDX - 2.4 m',
  [BoltType.D47_MDX_3_0_M]: 'D47 MDX - 3.0 m',
  [BoltType.D47_MDX_3_8_M]: 'D47 MDX - 3.8 m',
  [BoltType.D47_MDX_4_0_M]: 'D47 MDX - 4.0 m',
  [BoltType.D39_MDX_1_8_M]: 'D39 MDX - 1.8 m',
  [BoltType.D39_MDX_2_1_M]: 'D39 MDX - 2.1 m',
  [BoltType.D39_MDX_2_4_M]: 'D39 MDX - 2.4 m',
  [BoltType.D39_MDX_3_0_M]: 'D39 MDX - 3.0 m',
  [BoltType.D47_MDX_PEG_BOLT_1_8_M]: 'D47 MDX - Peg Bolt - 1.8 m',
  [BoltType.D47_MDX_PEG_BOLT_2_1_M]: 'D47 MDX - Peg Bolt - 2.1 m',
  [BoltType.D47_MDX_PEG_BOLT_2_4_M]: 'D47 MDX - Peg Bolt - 2.4 m',
  [BoltType.D47_MDX_PEG_BOLT_3_0_M]: 'D47 MDX - Peg Bolt - 3.0 m',
  [BoltType.D39_MDX_PEG_BOLT_1_8_M]: 'D39 MDX - Peg Bolt - 1.8 m',
  [BoltType.D39_MDX_PEG_BOLT_2_1_M]: 'D39 MDX - Peg Bolt - 2.1 m',
  [BoltType.D39_MDX_PEG_BOLT_2_4_M]: 'D39 MDX - Peg Bolt - 2.4 m',
  [BoltType.D39_MDX_PEG_BOLT_3_0_M]: 'D39 MDX - Peg Bolt - 3.0 m',
  [BoltType.D47_MD_PEG_BOLT_1_8_M]: 'D47 MD - Peg Bolt - 1.8 m',
  [BoltType.D47_MD_PEG_BOLT_2_1_M]: 'D47 MD - Peg Bolt - 2.1 m',
  [BoltType.D47_MD_PEG_BOLT_2_4_M]: 'D47 MD - Peg Bolt - 2.4 m',
  [BoltType.D47_MD_PEG_BOLT_3_0_M]: 'D47 MD - Peg Bolt - 3.0 m',
  [BoltType.FRICTION_BOLT_47_MM]: 'Friction Bolt Ø47 mm',
  [BoltType.FRICTION_BOLT_39_MM]: 'Friction Bolt Ø39 mm',
  [BoltType.FRICTION_BOLT_33_MM]: 'Friction Bolt Ø33 mm',
  [BoltType.SPIRAL_FRICTION_BOLT]: 'Spiral Friction Bolt',
  [BoltType.KINLOC_BOLT]: 'Kinloc Bolt',
  [BoltType.KINLOC_BOLT_INDIE]: 'Kinloc Bolt Indie',
};
