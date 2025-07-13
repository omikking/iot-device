import { useMemo } from 'react';
import {
  ContentHolder,
  DateRange,
  Dropdown,
  Label,
  RangeCalendar,
} from '@gsp/ui';
import { GetCompanyQuery, BoltResult } from '@/gql/graphql';
import { BoltResultsFilter, FilterState } from './BoltResultsFilter';

type CompanyType = GetCompanyQuery['company'];
type SiteType = NonNullable<CompanyType['sites']>[number];
type LevelType = NonNullable<SiteType['levels']>[number];
type DriveType = NonNullable<LevelType['drives']>[number];
type LocationType = NonNullable<DriveType['locations']>[number];

interface BoltSelectionProps {
  site?: SiteType;
  level?: LevelType;
  drive?: DriveType;
  location?: LocationType;
  dateRange?: DateRange;
  selectedTab?: string;
  filterState: FilterState;
  onSetSite: React.Dispatch<React.SetStateAction<SiteType | undefined>>;
  onSetLevel: React.Dispatch<React.SetStateAction<LevelType | undefined>>;
  onSetDrive: React.Dispatch<React.SetStateAction<DriveType | undefined>>;
  onSetLocation: React.Dispatch<React.SetStateAction<LocationType | undefined>>;
  onSetDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  onFilterChange: (filters: FilterState) => void;
  boltResults: BoltResult[];
  companyByIdResponse: GetCompanyQuery;
}

export const BoltSelection = ({
  companyByIdResponse,
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
  const siteOptions = useMemo(() => {
    return companyByIdResponse?.company?.sites || [];
  }, [companyByIdResponse]);

  const handleSetSite = (siteId?: string) => {
    const selectedSite = siteOptions.find((s) => s.id === siteId);
    onSetSite(selectedSite);
    onSetDateRange({ from: undefined, to: undefined });
    onSetLevel(undefined);
    onSetDrive(undefined);
    onSetLocation(undefined);
  };

  const levelsOptions = useMemo(() => {
    return site?.levels || [];
  }, [site]);

  const handleSetLevel = (levelId?: string) => {
    const selectedLevel = levelsOptions.find((l) => l.id === levelId);
    onSetLevel(selectedLevel);
    onSetDrive(undefined);
    onSetLocation(undefined);
  };

  const drivesOptions = useMemo(() => {
    return level?.drives || [];
  }, [level]);

  const handleSetDrive = (driveId?: string) => {
    const selectedDrive = drivesOptions.find((d) => d.id === driveId);
    onSetDrive(selectedDrive);
    onSetLocation(undefined);
  };

  const locationsOptions = useMemo(() => {
    return drive?.locations || [];
  }, [drive]);

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
          selectedId={site?.id}
          options={siteOptions}
          onSelect={handleSetSite}
          className="w-56"
        />
      </div>

      <div className="space-y-1.5 mt-0.5">
        <Label>Date range</Label>
        <RangeCalendar
          selected={dateRange}
          onSelect={(range) => {
            if (
              range &&
              typeof range === 'object' &&
              'from' in range &&
              'to' in range
            ) {
              onSetDateRange;
            }
          }}
          disabled={!site}
          className="w-72"
        />
      </div>

      <div className="space-y-1.5 mt-0.5">
        <Label>Level</Label>
        <Dropdown
          id="level"
          isResettable
          disabled={!site || !dateRange || levelsOptions.length === 0}
          placeholder="Select level"
          selectedId={level?.id}
          options={levelsOptions}
          onSelect={handleSetLevel}
          className="w-56"
        />
      </div>

      <div className="space-y-1.5 mt-0.5">
        <Label>Drive</Label>
        <Dropdown
          id="drive"
          isResettable
          disabled={!level || drivesOptions.length === 0}
          placeholder="Select drive"
          selectedId={drive?.id}
          options={drivesOptions}
          onSelect={handleSetDrive}
          className="w-56"
        />
      </div>

      <div className="space-y-1.5 mt-0.5">
        <Label>Location</Label>
        <Dropdown
          id="location"
          isResettable
          disabled={!drive || locationsOptions.length === 0}
          placeholder="Select location"
          selectedId={location?.id}
          options={locationsOptions}
          onSelect={(locationId) => {
            const selectedLocation = locationsOptions.find(
              (loc) => loc.id === locationId,
            );
            onSetLocation(selectedLocation);
          }}
          className="w-56"
        />
      </div>
    </ContentHolder>
  );
};
