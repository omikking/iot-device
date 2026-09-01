// Bolts a channel can be assigned to.
//
// PLACEHOLDER DATA. The API already exposes everything needed here through the
// `hydrabolts` query (Hydrabolt.partNumber / numberOfFBG / initialWavelength),
// so replacing this file with that query is the next step; the shape below is
// deliberately a subset of the Hydrabolt type so the swap is a straight
// substitution. `numberOfFBG` is what decides the `KA` grating count and the
// number of `Ke` windows in the interrogator init string, so a wrong value here
// silently mis-programmes the device — nothing else in the app can catch it.

import type { InterrogatorChannel } from '@/ble/hydraInterrogatorConfig';

export interface HydraBoltRecord {
  /** Serial number the installer reads off the physical tag. */
  serialNumber: string;
  /** Human-facing bolt name, e.g. "R12-P1". */
  name: string;
  partNumber: string;
  numberOfFBG: number;
  /** Grating centre wavelengths in nm; empty falls back to the nominal grid. */
  initialWavelength: number[];
}

export const HYDRA_BOLT_CATALOGUE: HydraBoltRecord[] = [
  { serialNumber: 'HB0004812', name: 'R12-P1', partNumber: 'MDX-9-2400', numberOfFBG: 9, initialWavelength: [] },
  { serialNumber: 'HB0004813', name: 'R12-P3', partNumber: 'MDX-9-2400', numberOfFBG: 9, initialWavelength: [] },
  { serialNumber: 'HB0004814', name: 'R12-P5', partNumber: 'MDX-9-2400', numberOfFBG: 9, initialWavelength: [] },
  { serialNumber: 'HB0004815', name: 'R12-P7', partNumber: 'MDX-5-1800', numberOfFBG: 5, initialWavelength: [] },
  { serialNumber: 'HB0004816', name: 'R13-P1', partNumber: 'MDX-9-2400', numberOfFBG: 9, initialWavelength: [] },
  { serialNumber: 'HB0004817', name: 'R13-P4', partNumber: 'MD-3-1500', numberOfFBG: 3, initialWavelength: [] },
  { serialNumber: 'HB0004818', name: 'R13-P6', partNumber: 'MDX-9-2400', numberOfFBG: 9, initialWavelength: [] },
  { serialNumber: 'HB0004819', name: 'R14-P2', partNumber: 'MDX-5-1800', numberOfFBG: 5, initialWavelength: [] },
  { serialNumber: 'HB0004820', name: 'R14-P5', partNumber: 'MD-3-1500', numberOfFBG: 3, initialWavelength: [] },
];

const BY_SERIAL = new Map(
  HYDRA_BOLT_CATALOGUE.map((bolt) => [bolt.serialNumber, bolt]),
);

export function findBoltBySerial(
  serialNumber: string,
): HydraBoltRecord | undefined {
  return serialNumber ? BY_SERIAL.get(serialNumber) : undefined;
}

/** The interrogator's view of a bolt: how many gratings and where they sit. */
export function boltToInterrogatorChannel(
  bolt: HydraBoltRecord | undefined,
): InterrogatorChannel {
  if (!bolt) return { fbgCount: 0 };
  return {
    fbgCount: bolt.numberOfFBG,
    centreWavelengthsNm:
      bolt.initialWavelength.length > 0 ? bolt.initialWavelength : undefined,
  };
}
