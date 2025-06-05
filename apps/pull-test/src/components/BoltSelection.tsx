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

const getCompanyQuery = gql`
  query GetCompany($id: String!) {
    company(id: $id) {
      sites {
        id
        siteName
        levels {
          levelName
          id
          drives {
            driveName
            id
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

type SiteOption = {
  id: string;
  name: string;
};

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
  onSetSite: React.Dispatch<React.SetStateAction<SiteOption | undefined>>;
  onSetLevel: React.Dispatch<React.SetStateAction<SiteOption | undefined>>;
  onSetDrive: React.Dispatch<React.SetStateAction<SiteOption | undefined>>;
  onSetLocation: React.Dispatch<React.SetStateAction<SiteOption | undefined>>;
  onSetDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  onFilterChange: (filters: FilterState) => void;
  boltResults: BoltResultSchema[];
  companyId?: string;
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
  companyId,
}: BoltSelectionProps) => {
  const [{ data: compnayIdCompanyDetails }] = useQuery({
    query: getCompanyQuery,
    variables: {
      id: companyId,
    },
  });

  const siteOptions = useMemo(() => {
    if (!compnayIdCompanyDetails?.company?.sites) return [];

    return compnayIdCompanyDetails?.company?.sites.map(
      (site: { levels: any; id: string; siteName: string }) => ({
        id: site.id,
        name: site.siteName,
        levels: site.levels,
      }),
    );
  }, [compnayIdCompanyDetails]);

  const handleSetSite = (site?: string) => {
    const siteDetails = siteOptions.find(
      (sites: SiteOption) => sites.id === site,
    );
    onSetSite(siteDetails);
    onSetDateRange({
      from: undefined,
      to: undefined,
    });
    onSetLevel(undefined);
    onSetDrive(undefined);
    onSetLocation(undefined);
  };

  const handleSetLevel = (levelId?: string) => {
    const levelOption = levelsOptionsMock.find((l) => l.id === levelId);
    onSetLevel(levelOption); // <-- This is typed as SiteOption, adjust if needed
    onSetDrive(undefined);
    onSetLocation(undefined);
  };

  const handleSetDrive = (drive?: string) => {
    onSetDrive(drive);
    onSetLocation(undefined);
  };

  // Finds available levels on the selected site
  const levelsOptionsMock = useMemo(() => {
    const levels = siteOptions.flatMap((site) => site.levels || []);
    return (
      levels.map((level: { drives: any; id: string; levelName: string }) => ({
        id: level.id,
        name: level.levelName,
        drives: level.drives,
      })) || []
    );
  }, [siteOptions]);

  const drivesOptionsMock = useMemo(() => {
    const selectedLevel = levelsOptionsMock.find((lvl) => lvl.id === level);
    const drives = selectedLevel?.drives || [];
    return drives.map(
      (drive: { locations: any; id: string; driveName: string }) => ({
        id: drive.id,
        name: drive.driveName,
        locations: drive.locations,
      }),
    );
  }, [levelsOptionsMock, level]);

  const locationsOptionsMock = useMemo(() => {
    const selectedLevel = levelsOptionsMock.find((lvl) => lvl.id === level);
    const selectedDrive = selectedLevel?.drives?.find(
      (drv) => drv.id === drive,
    );
    const locations = selectedDrive?.locations || [];
    console.log(selectedDrive, 'selectedDrive');
    return locations.map((location: { id: string; locationName: string }) => ({
      id: location.id,
      name: location.locationName,
    }));
  }, [levelsOptionsMock, level, drive]);

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
          // disabled={!site}
          className="w-72"
        />
      </div>

      <div className="space-y-1.5 mt-0.5">
        <Label>Level</Label>
        <Dropdown
          id="level"
          isResettable
          // disabled={!site || !dateRange || !levelsOptionsMock}
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
          // disabled={!level || !drivesOptionsMock}
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
          // disabled={!drive || !locationsOptionsMock}
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
