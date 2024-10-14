'use client';

import {
  ContentHolder,
  DateRange,
  Dropdown,
  DropdownItem,
  Label,
  RangeCalendar,
} from '@gsp/ui';
import { BoltResultsFilter } from './BoltResultsFilter';
import { sitesMock } from '@/app/mock/mock';

// Is this typing really correct?
type SetRangeDateType = React.ReactEventHandler<HTMLDivElement> &
  React.Dispatch<React.SetStateAction<DateRange | undefined>>;

interface BoltSelectionProps {
  site?: string;
  level?: string;
  drive?: string;
  position?: string;
  dateRange?: DateRange;
  selectedTab?: string;
  // Is this typing correct? or should it be (id: string) => void;
  onSetSite: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetLevel: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetDrive: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetPosition: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export const BoltSelection = ({
  site,
  level,
  drive,
  position,
  dateRange,
  selectedTab,
  onSetSite,
  onSetLevel,
  onSetDrive,
  onSetPosition,
  onSetDateRange,
}: BoltSelectionProps) => {
  const handleSetSite = (site?: string) => {
    onSetSite(site);
    onSetDateRange({
      from: undefined,
      to: undefined,
    });
    onSetLevel(undefined);
    onSetDrive(undefined);
    onSetPosition(undefined);
  };

  const handleSetLevel = (level?: string) => {
    onSetLevel(level);
    onSetDrive(undefined);
    onSetPosition(undefined);
  };

  const handleSetDrive = (drive?: string) => {
    onSetDrive(drive);
    onSetPosition(undefined);
  };

  // Finds available levels on the selected site
  const levelsOptionsMock = sitesMock.find(
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
      <BoltResultsFilter selectedTab={selectedTab} />

      <div className="space-y-1.5 mt-0.5">
        <Label>Site</Label>
        <Dropdown
          id="site"
          isResettable
          placeholder="Select site"
          selectedId={site}
          options={sitesMock as DropdownItem[]}
          onSelect={handleSetSite}
          className="w-56"
        />
      </div>

      <div className="space-y-1.5 mt-0.5">
        <Label>Date range</Label>
        <RangeCalendar
          selected={dateRange}
          onSelect={onSetDateRange as SetRangeDateType}
          disabled={!site}
          className="w-72"
        />
      </div>

      <div className="space-y-1.5 mt-0.5">
        <Label>Level</Label>
        <Dropdown
          id="level"
          isResettable
          disabled={!levelsOptionsMock}
          placeholder="Select level"
          selectedId={level}
          options={levelsOptionsMock as DropdownItem[]}
          onSelect={handleSetLevel}
          className="w-56"
        />
      </div>

      <div className="space-y-1.5 mt-0.5">
        <Label>Drive</Label>
        <Dropdown
          id="drive"
          isResettable
          disabled={!drivesOptionsMock}
          placeholder="Select drive"
          selectedId={drive}
          options={drivesOptionsMock as DropdownItem[]}
          onSelect={handleSetDrive}
          className="w-56"
        />
      </div>

      <div className="space-y-1.5 mt-0.5">
        <Label>Position</Label>
        <Dropdown
          id="position"
          isResettable
          disabled={!positionsOptionsMock}
          placeholder="Select position"
          selectedId={position}
          options={positionsOptionsMock as DropdownItem[]}
          onSelect={onSetPosition}
          className="w-56"
        />
      </div>
    </ContentHolder>
  );
};
