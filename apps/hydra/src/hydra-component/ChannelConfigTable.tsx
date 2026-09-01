'use client';

import {
  DropdownSearch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@gsp/ui-core';
import {
  boltForRow,
  fibreOfChannel,
  type ChannelRow,
  type ChannelRowField,
} from './channelRows';
import { HYDRA_BOLT_CATALOGUE } from './hydraBoltCatalogue';

const DROPDOWN_CLASS =
  'flex w-full h-full border-none rounded bg-neutral-1 text-md font-sandvik-text text-main-black placeholder:text-main-black outline-none focus-visible:border-blue-primary transition ease-in-out duration-200';

// ui-core's TableHead ships `p-0` plus per-column alignment baked in by index
// (1st/2nd centred, 5th right, last `flex`). None of that suits this table, and
// ui-core's stylesheet loads after Hydra's, so the resets need `!`.
const HEAD_CLASS =
  '!text-left [&:last-child]:!table-cell align-middle whitespace-nowrap px-3 py-2';

const CELL_CLASS = 'align-middle px-3 py-2';

// Placeholder option lists — unlike Serial Number these do not yet come from a
// backing record, and none of them feed the interrogator init strings.
const POSITION_OPTIONS = [
  { id: 'pos-1', name: 'Position in ring' },
  { id: 'pos-2', name: 'Crown' },
  { id: 'pos-3', name: 'Sidewall' },
];

const SITE_OPTIONS = [
  { id: 'site-1', name: 'Site A' },
  { id: 'site-2', name: 'Site B' },
];

const LEVEL_OPTIONS = [
  { id: 'level-1', name: 'Level A' },
  { id: 'level-2', name: 'Level B' },
];

const LOCATION_OPTIONS = [
  { id: 'location-1', name: 'Location A' },
  { id: 'location-2', name: 'Location B' },
];

interface ChannelConfigTableProps {
  rows: ChannelRow[];
  onChange: (channel: number, field: ChannelRowField, value: string) => void;
  /** Local items stay locked until the logger is paired. */
  disabled?: boolean;
}

function DerivedCell({ value }: { value: string | null }) {
  return (
    <Text variant="small" color={value ? 'foreground' : 'muted'}>
      {value ?? '—'}
    </Text>
  );
}

export function ChannelConfigTable({
  rows,
  onChange,
  disabled = false,
}: ChannelConfigTableProps) {
  const assignedSerials = new Set(
    rows.map((row) => row.serialNumber).filter(Boolean),
  );

  /** One bolt lives on one fibre, so anything already placed is not offerable. */
  const serialOptionsFor = (row: ChannelRow) =>
    HYDRA_BOLT_CATALOGUE.filter(
      (bolt) =>
        bolt.serialNumber === row.serialNumber ||
        !assignedSerials.has(bolt.serialNumber),
    ).map((bolt) => ({ id: bolt.serialNumber, name: bolt.serialNumber }));

  return (
    <div className="overflow-x-auto">
      <Table variant="border">
        <TableHeader>
          <TableRow>
            <TableHead className={HEAD_CLASS}>Channel</TableHead>
            <TableHead className={HEAD_CLASS}>Serial Number</TableHead>
            <TableHead className={HEAD_CLASS}>Name</TableHead>
            <TableHead className={HEAD_CLASS}>Position</TableHead>
            <TableHead className={HEAD_CLASS}>Site</TableHead>
            <TableHead className={HEAD_CLASS}>Level</TableHead>
            <TableHead className={HEAD_CLASS}>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const bolt = boltForRow(row);
            const fibre = fibreOfChannel(row.channel);

            return (
              <TableRow key={row.channel}>
                <TableCell className={CELL_CLASS}>
                  <Text variant="small" color="foreground">
                    Channel {row.channel}
                    {/* <span className="text-neutral-5"> · f{fibre}</span> */}
                  </Text>
                </TableCell>
                <TableCell className={CELL_CLASS}>
                  <DropdownSearch
                    id={`channel-${row.channel}-serial`}
                    options={serialOptionsFor(row)}
                    selectedId={row.serialNumber}
                    placeholder="Serial Number"
                    searchPlaceholder="Search..."
                    disabled={disabled}
                    onSelect={(id) =>
                      onChange(row.channel, 'serialNumber', id ?? '')
                    }
                    className={DROPDOWN_CLASS}
                  />
                </TableCell>
                <TableCell className={CELL_CLASS}>
                  <DerivedCell value={bolt?.name ?? null} />
                </TableCell>
                <TableCell className={CELL_CLASS}>
                  <DropdownSearch
                    id={`channel-${row.channel}-position`}
                    options={POSITION_OPTIONS}
                    selectedId={row.positionId}
                    placeholder="Position in ring"
                    searchPlaceholder="Search..."
                    disabled={disabled}
                    onSelect={(id) => onChange(row.channel, 'positionId', id ?? '')}
                    className={DROPDOWN_CLASS}
                  />
                </TableCell>
                <TableCell className={CELL_CLASS}>
                  <DropdownSearch
                    id={`channel-${row.channel}-site`}
                    options={SITE_OPTIONS}
                    selectedId={row.siteId}
                    placeholder="Site"
                    searchPlaceholder="Search..."
                    disabled={disabled}
                    onSelect={(id) => onChange(row.channel, 'siteId', id ?? '')}
                    className={DROPDOWN_CLASS}
                  />
                </TableCell>
                <TableCell className={CELL_CLASS}>
                  <DropdownSearch
                    id={`channel-${row.channel}-level`}
                    options={LEVEL_OPTIONS}
                    selectedId={row.levelId}
                    placeholder="Level"
                    searchPlaceholder="Search..."
                    disabled={disabled}
                    onSelect={(id) => onChange(row.channel, 'levelId', id ?? '')}
                    className={DROPDOWN_CLASS}
                  />
                </TableCell>
                <TableCell className={CELL_CLASS}>
                  <DropdownSearch
                    id={`channel-${row.channel}-location`}
                    options={LOCATION_OPTIONS}
                    selectedId={row.locationId}
                    placeholder="Location"
                    searchPlaceholder="Search..."
                    disabled={disabled}
                    onSelect={(id) => onChange(row.channel, 'locationId', id ?? '')}
                    className={DROPDOWN_CLASS}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
