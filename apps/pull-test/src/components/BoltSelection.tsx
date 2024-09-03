'use client';

import { ContentHolder, Dropdown, DropdownItem, Label } from '@gsp/ui';
import { BoltResultsFilter } from './BoltResultsFilter';

const sitesOptionsMock = [
  {
    id: '1',
    name: 'Garpenberg site',
    levels: [
      {
        id: '1',
        name: '4002',
        drives: [
          {
            id: '1',
            name: '2001',
            positions: [
              {
                id: '1',
                name: '20, 42',
              },
              {
                id: '2',
                name: '22, 49',
              },
              {
                id: '3',
                name: '26, 55',
              },
              {
                id: '4',
                name: '29, 50',
              },
              {
                id: '5',
                name: '33, 65',
              },
              {
                id: '6',
                name: '34, 63',
              },
            ],
          },
          {
            id: '2',
            name: '2002',
            positions: [
              {
                id: '1',
                name: '1, 2',
              },
            ],
          },
          {
            id: '3',
            name: '2003',
            positions: [
              {
                id: '1',
                name: '2, 43',
              },
              {
                id: '2',
                name: '25, 55',
              },
            ],
          },
        ],
      },
      {
        id: '2',
        name: '4003',
        drives: [
          {
            id: '1',
            name: '2007',
            positions: [
              {
                id: '1',
                name: '22, 433',
              },
              {
                id: '2',
                name: '525, 545',
              },
            ],
          },
          {
            id: '2',
            name: '2008',
            positions: [
              {
                id: '1',
                name: '2222, 433',
              },
              {
                id: '2',
                name: '251, 5225',
              },
            ],
          },
        ],
      },
      {
        id: '3',
        name: '4004',
        drives: [
          {
            id: '1',
            name: '5007',
            positions: [
              {
                id: '1',
                name: '2222, 433',
              },
              {
                id: '2',
                name: '251, 5225',
              },
            ],
          },
          {
            id: '2',
            name: '5008',
            positions: [],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Gollum site',
    levels: [],
  },
  {
    id: '3',
    name: 'Kiruna site',
    levels: [],
  },
];

interface BoltSelectionProps {
  site?: string;
  level?: string;
  drive?: string;
  position?: string;
  // Is this typing correct? or should it be (id: string) => void;
  onSetSite: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetLevel: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetDrive: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetPosition: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// @TODO: Add filtering functionality, this is essentially a visual mockup currently.
export const BoltSelection = ({
  site,
  level,
  drive,
  position,
  onSetSite,
  onSetLevel,
  onSetDrive,
  onSetPosition,
}: BoltSelectionProps) => {
  const handleSetSite = (site: string) => {
    onSetSite(site);
    onSetLevel(undefined);
    onSetDrive(undefined);
    onSetPosition(undefined);
  };

  const handleSetLevel = (level: string) => {
    onSetLevel(level);
    onSetDrive(undefined);
    onSetPosition(undefined);
  };

  const handleSetDrive = (drive: string) => {
    onSetDrive(drive);
    onSetPosition(undefined);
  };

  // Finds available levels on the selected site
  const levelsOptionsMock = sitesOptionsMock.find(
    (boltSites) => boltSites.name === site,
  )?.levels;

  // Finds available levels on the selected site
  const drivesOptionsMock = levelsOptionsMock?.find(
    (boltLevels) => boltLevels.name === level,
  )?.drives;

  const positionsOptionsMock = drivesOptionsMock?.find(
    (boltDrives) => boltDrives.name === drive,
  )?.positions;

  return (
    <ContentHolder variant="filter">
      <BoltResultsFilter />

      <div className="ui-space-y-1.5 mt-0.5">
        <Label>Site</Label>
        <Dropdown
          id="site"
          placeholder="Select site"
          selectedId={site}
          options={sitesOptionsMock as DropdownItem[]}
          onSelect={handleSetSite}
          className="w-80"
        />
      </div>

      <div className="ui-space-y-1.5 mt-0.5">
        <Label>Level</Label>
        <Dropdown
          id="level"
          disabled={!levelsOptionsMock}
          placeholder="Select level"
          selectedId={level}
          options={levelsOptionsMock as DropdownItem[]}
          onSelect={handleSetLevel}
          className="w-80"
        />
      </div>

      <div className="ui-space-y-1.5 mt-0.5">
        <Label>Drive</Label>
        <Dropdown
          id="drive"
          disabled={!drivesOptionsMock}
          placeholder="Select drive"
          selectedId={drive}
          options={drivesOptionsMock as DropdownItem[]}
          onSelect={handleSetDrive}
          className="w-80"
        />
      </div>

      <div className="ui-space-y-1.5 mt-0.5">
        <Label>Position</Label>
        <Dropdown
          id="position"
          disabled={!positionsOptionsMock}
          placeholder="Select position"
          selectedId={position}
          options={positionsOptionsMock as DropdownItem[]}
          onSelect={onSetPosition}
          className="w-80"
        />
      </div>
    </ContentHolder>
  );
};
