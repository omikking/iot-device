'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  ContentHolder,
  DateRange,
  Dropdown,
  DropdownItem,
  Label,
  RangeCalendar,
  Text,
} from '@gsp/ui';
import { BoltResultsFilter } from './BoltResultsFilter';
import { sitesMock } from '@/app/mock/mock';

// @TODO Is this typing really correct?
type SetRangeDateType = React.ReactEventHandler<HTMLDivElement> &
  React.Dispatch<React.SetStateAction<DateRange | undefined>>;

interface BoltSelectionProps {
  site?: string;
  level?: string;
  drive?: string;
  location?: string;
  dateRange?: DateRange;
  selectedTab?: string;
  // Is this typing correct? or should it be (id: string) => void;
  onSetSite: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetLevel: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetDrive: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetLocation: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export const BoltSelection = ({
  site,
  level,
  drive,
  location,
  dateRange,
  selectedTab,
  onSetSite,
  onSetLevel,
  onSetDrive,
  onSetLocation,
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
    onSetLocation(undefined);
  };

  const handleSetLevel = (level?: string) => {
    onSetLevel(level);
    onSetDrive(undefined);
    onSetLocation(undefined);
  };

  const handleSetDrive = (drive?: string) => {
    onSetDrive(drive);
    onSetLocation(undefined);
  };

  // Finds available levels on the selected site
  const levelsOptionsMock = sitesMock.find(
    (boltSites) => boltSites.name === site,
  )?.levels;

  // Finds available levels on the selected site
  const drivesOptionsMock = levelsOptionsMock?.find(
    (boltLevels) => boltLevels.name === level,
  )?.drives;

  const locationsOptionsMock = drivesOptionsMock?.find(
    (boltDrives) => boltDrives.name === drive,
  )?.locations;

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
        <Label>Location</Label>
        <Dropdown
          id="location"
          isResettable
          disabled={!locationsOptionsMock}
          placeholder="Select location"
          selectedId={location}
          options={locationsOptionsMock as DropdownItem[]}
          onSelect={onSetLocation}
          className="w-56"
        />
      </div>
    </ContentHolder>
  );
};
