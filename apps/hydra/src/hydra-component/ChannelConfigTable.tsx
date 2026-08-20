'use client';

import { useState } from 'react';
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

const DROPDOWN_CLASS =
  'flex w-full h-full border-none rounded bg-neutral-1 text-md font-sandvik-text text-main-black placeholder:text-main-black outline-none focus-visible:border-blue-primary transition ease-in-out duration-200';

const SERIAL_OPTIONS = [
  { id: 'sn-1', name: 'SN-001' },
  { id: 'sn-2', name: 'SN-002' },
];

const NAME_OPTIONS = [
  { id: 'name-1', name: 'Sensor A' },
  { id: 'name-2', name: 'Sensor B' },
];

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

type ChannelRow = {
  channel: number;
  serialNumberId: string;
  nameId: string;
  positionId: string;
  siteId: string;
  levelId: string;
  locationId: string;
};

const INITIAL_ROWS: ChannelRow[] = Array.from({ length: 9 }, (_, i) => ({
  channel: i + 1,
  serialNumberId: '',
  nameId: '',
  positionId: '',
  siteId: '',
  levelId: '',
  locationId: '',
}));

export function ChannelConfigTable() {
  const [rows, setRows] = useState<ChannelRow[]>(INITIAL_ROWS);

  const updateRow = (
    channel: number,
    field: keyof Omit<ChannelRow, 'channel'>,
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.channel === channel ? { ...row, [field]: value } : row,
      ),
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table variant="border">
        <TableHeader>
          <TableRow>
            <TableHead>Channel</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Site</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.channel}>
              <TableCell>
                <Text variant="small" color="foreground">
                  Channel {row.channel}
                </Text>
              </TableCell>
              <TableCell>
                <DropdownSearch
                  id={`channel-${row.channel}-serial`}
                  options={SERIAL_OPTIONS}
                  selectedId={row.serialNumberId}
                  placeholder="Serial Number"
                  searchPlaceholder="Search..."
                  onSelect={(id) =>
                    updateRow(row.channel, 'serialNumberId', id ?? '')
                  }
                  className={DROPDOWN_CLASS}
                />
              </TableCell>
              <TableCell>
                <DropdownSearch
                  id={`channel-${row.channel}-name`}
                  options={NAME_OPTIONS}
                  selectedId={row.nameId}
                  placeholder="Name"
                  searchPlaceholder="Search..."
                  onSelect={(id) => updateRow(row.channel, 'nameId', id ?? '')}
                  className={DROPDOWN_CLASS}
                />
              </TableCell>
              <TableCell>
                <DropdownSearch
                  id={`channel-${row.channel}-position`}
                  options={POSITION_OPTIONS}
                  selectedId={row.positionId}
                  placeholder="Position in ring"
                  searchPlaceholder="Search..."
                  onSelect={(id) =>
                    updateRow(row.channel, 'positionId', id ?? '')
                  }
                  className={DROPDOWN_CLASS}
                />
              </TableCell>
              <TableCell>
                <DropdownSearch
                  id={`channel-${row.channel}-site`}
                  options={SITE_OPTIONS}
                  selectedId={row.siteId}
                  placeholder="Site"
                  searchPlaceholder="Search..."
                  onSelect={(id) => updateRow(row.channel, 'siteId', id ?? '')}
                  className={DROPDOWN_CLASS}
                />
              </TableCell>
              <TableCell>
                <DropdownSearch
                  id={`channel-${row.channel}-level`}
                  options={LEVEL_OPTIONS}
                  selectedId={row.levelId}
                  placeholder="Level"
                  searchPlaceholder="Search..."
                  onSelect={(id) => updateRow(row.channel, 'levelId', id ?? '')}
                  className={DROPDOWN_CLASS}
                />
              </TableCell>
              <TableCell>
                <DropdownSearch
                  id={`channel-${row.channel}-location`}
                  options={LOCATION_OPTIONS}
                  selectedId={row.locationId}
                  placeholder="Location"
                  searchPlaceholder="Search..."
                  onSelect={(id) =>
                    updateRow(row.channel, 'locationId', id ?? '')
                  }
                  className={DROPDOWN_CLASS}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
