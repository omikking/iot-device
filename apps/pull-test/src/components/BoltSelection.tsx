'use client';

import {
  ContentHolder,
  DateRange,
  Dropdown,
  DropdownItem,
  Label,
  RangeCalendar,
} from '@gsp/ui';
import { BoltResultsFilter, FilterState } from './BoltResultsFilter';
import { useQuery } from 'urql';
import { useMemo } from 'react';

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
  filterState: FilterState;
  // Is this typing correct? or should it be (id: string) => void;
  onSetSite: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetLevel: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetDrive: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetLocation: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSetDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  onFilterChange: (filters: FilterState) => void;
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
  onFilterChange,
}: BoltSelectionProps) => {
  const SitesQurey = `
  query {
  boltResults {
    site {
      id
      siteName
      address
      postalCode
      city
      country
      companyId
      createdAt
      updatedAt
      levels {
        id
        levelName
        drives {
          id
          driveName
          locations {
            id
            locationName
          }
        }
      }
    }
  }
}

`;
  const [{ data: SitesQureyResponse }] = useQuery({
    query: SitesQurey,
  });

  const siteNames = useMemo(() => {
    return SitesQureyResponse?.boltResults
      .map((item: { site: { id: string; siteName: string } }) => ({
        id: item.site.id,
        name: item.site.siteName,
      }))
      .reduce(
        (acc: { id: string }[], current: { id: string }) => {
          if (!acc.some((site) => site.id === current.id)) {
            acc.push(current);
          }
          return acc;
        },
        [] as { id: string }[],
      );
  }, [SitesQureyResponse]);

  const levelsOptionsMock = useMemo(() => {
    return SitesQureyResponse?.boltResults
      ?.find(
        (boltSites: { name: string | undefined }) => boltSites.name === site,
      )
      ?.site.levels?.map(
        (elem: { id: unknown; levelName: string; drives: string }) => ({
          id: elem.id,
          name: elem.levelName,
          drives: elem.drives,
        }),
      );
  }, [SitesQureyResponse, site]);

  const drivesOptionsMock = useMemo(() => {
    const levelData = levelsOptionsMock?.find(
      (boltLevels: { name: string | undefined }) => boltLevels.name === level,
    );
    return levelData?.drives?.map(
      (elem: { id: string; driveName: string; locations: string }) => ({
        id: elem.id,
        name: elem.driveName,
        location: elem.locations,
      }),
    );
  }, [levelsOptionsMock, level]);

  const locationsOptionsMock = useMemo(() => {
    return drivesOptionsMock
      ?.find((elem: { name: string | undefined }) => elem.name === drive)
      ?.location?.map((elem: { locationName: unknown; id: string }) => ({
        name: elem.locationName,
        id: elem.id,
      }));
  }, [drivesOptionsMock, drive]);

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

  return (
    <ContentHolder variant="filter">
      <BoltResultsFilter
        selectedTab={selectedTab}
        onFilterChange={onFilterChange}
      />

      <div className="space-y-1.5 mt-0.5">
        <Label>Site</Label>
        <Dropdown
          id="site"
          isResettable
          placeholder="Select site"
          selectedId={site}
          options={siteNames as DropdownItem[]}
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
