'use client';
import { useMemo } from 'react';
import {
  ContentHolder,
  DateRange,
  Dropdown,
  DropdownItem,
  Label,
  RangeCalendar,
} from '@gsp/ui';
import { BoltResultsFilter, FilterState } from './BoltResultsFilter';
import { BoltResultSchema } from '@/app/mock/mock';
import { gql } from 'urql';
import { useQuery } from 'urql';

export const GET_SITES = gql`
  query GetSites {
    sites {
      id
      siteName
    }
  }
`;

export const GET_LEVELS = gql`
  query GetLevels($siteId: ID!) {
    levels(siteId: $siteId) {
      id
      name
    }
  }
`;

export const GET_DRIVES = gql`
  query GetDrives($levelId: ID!) {
    drives(levelId: $levelId) {
      id
      name
    }
  }
`;

export const GET_LOCATIONS = gql`
  query GetLocations($driveId: ID!) {
    locations(driveId: $driveId) {
      id
      name
    }
  }
`;


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
  boltResults: BoltResultSchema[];
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
  boltResults,
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

  const [{ data, fetching, error }] = useQuery({
    query: GET_SITES,
  });

  const siteOptions = useMemo(() => {
    if (fetching || error || !data?.sites) return [];
    return data.sites.map((site: { id: string; siteName: string }) => ({
      id: site.id,
      name: site.siteName,
    }));
  }, [data, fetching, error]);

  const [{ data: levelsData }] = useQuery({
    query: GET_LEVELS,
    variables: { siteId: site },
    pause: !site || !dateRange,
  });

  const [{ data: drivesData }] = useQuery({
    query: GET_DRIVES,
    variables: { levelId: level },
    pause: !level,
  });

  const [{ data: locationsData }] = useQuery({
    query: GET_LOCATIONS,
    variables: { driveId: drive },
    pause: !drive,
  });


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
  const levelsOptionsMock = useMemo(() => {
    return levelsData?.levels?.map((level: { id: string; name: string }) => ({
      id: level.id,
      name: level.name,
    })) || [];
  }, [levelsData]);


  // Finds available levels on the selected site
  const drivesOptionsMock = useMemo(() => {
    return drivesData?.drives?.map((drive: { id: string; name: string }) => ({
      id: drive.id,
      name: drive.name,
    })) || [];
  }, [drivesData]);


  const locationsOptionsMock = useMemo(() => {
    return locationsData?.locations?.map((location: { id: string; name: string }) => ({
      id: location.id,
      name: location.name,
    })) || [];
  }, [locationsData]);

  /*const uniqueSites = useMemo(() => {
    const uniqueSitesMap = new Map();
    boltResults.forEach(bolts => {
      uniqueSitesMap.set(bolts.siteId, {
        id: bolts.siteId,
        name: bolts.site.siteName
      });
    });
    return [...uniqueSitesMap.values()];
  }, [boltResults]);*/



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
          options={siteOptions as DropdownItem[]}
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
          disabled={!site || !dateRange || !levelsOptionsMock}
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
          disabled={!level || !drivesOptionsMock}
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
          disabled={!drive || !locationsOptionsMock}
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
