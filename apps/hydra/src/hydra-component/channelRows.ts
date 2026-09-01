// The nine channel assignments behind the Channels table.
//
// Channel assignment is cloud state, not device state: the interrogator init
// strings the logger holds carry grating counts but not which bolt is on which
// fibre, so a paired device can never tell us these rows back. What it does
// determine is configs 28–30 — see hydraInterrogatorConfig.

import {
  CHANNEL_COUNT,
  FIBRES_PER_INTERROGATOR,
  type InterrogatorChannel,
} from '@/ble/hydraInterrogatorConfig';
import {
  boltToInterrogatorChannel,
  findBoltBySerial,
  type HydraBoltRecord,
} from './hydraBoltCatalogue';

export interface ChannelRow {
  /** 1-based, as labelled in the UI. */
  channel: number;
  /** Serial number of the assigned bolt; '' when the channel is unused. */
  serialNumber: string;
  positionId: string;
  siteId: string;
  levelId: string;
  locationId: string;
}

export type ChannelRowField = Exclude<keyof ChannelRow, 'channel'>;

export const EMPTY_CHANNEL_ROWS: ChannelRow[] = Array.from(
  { length: CHANNEL_COUNT },
  (_, index) => ({
    channel: index + 1,
    serialNumber: '',
    positionId: '',
    siteId: '',
    levelId: '',
    locationId: '',
  }),
);

/** 0-based interrogator module a channel belongs to. */
export function interrogatorOfChannel(channel: number): number {
  return Math.floor((channel - 1) / FIBRES_PER_INTERROGATOR);
}

/** 0-based fibre within that module — the `KA`/`Ke` fibre argument. */
export function fibreOfChannel(channel: number): number {
  return (channel - 1) % FIBRES_PER_INTERROGATOR;
}

export function boltForRow(row: ChannelRow): HydraBoltRecord | undefined {
  return findBoltBySerial(row.serialNumber);
}

/** What the interrogator needs to know about each channel, in channel order. */
export function channelRowsToInterrogatorChannels(
  rows: readonly ChannelRow[],
): InterrogatorChannel[] {
  return Array.from({ length: CHANNEL_COUNT }, (_, index) => {
    const row = rows[index];
    return row
      ? boltToInterrogatorChannel(boltForRow(row))
      : { fbgCount: 0 };
  });
}

/**
 * A bolt sits on exactly one fibre, so assigning it to a channel has to clear
 * it from whichever channel held it before — otherwise two fibres would be
 * programmed for the same physical bolt.
 */
export function applyChannelRowChange(
  rows: readonly ChannelRow[],
  channel: number,
  field: ChannelRowField,
  value: string,
): ChannelRow[] {
  return rows.map((row) => {
    if (row.channel === channel) return { ...row, [field]: value };
    if (field === 'serialNumber' && value !== '' && row.serialNumber === value) {
      return { ...row, serialNumber: '' };
    }
    return row;
  });
}

export function channelRowsEqual(
  a: readonly ChannelRow[],
  b: readonly ChannelRow[],
): boolean {
  if (a.length !== b.length) return false;
  return a.every((row, index) => {
    const other = b[index];
    return (
      row.channel === other.channel &&
      row.serialNumber === other.serialNumber &&
      row.positionId === other.positionId &&
      row.siteId === other.siteId &&
      row.levelId === other.levelId &&
      row.locationId === other.locationId
    );
  });
}
