import {
  Label,
  Dropdown,
  DateRange,
  RangeCalendar,
  ContentHolder,
} from '@gsp/ui';
import { useMemo } from 'react';
import {
  GetCompanyQuery,
  BoltResult,
  Drive,
  Level,
  Site,
  Location,
} from '@/gql/graphql';
import { BoltResultsFilter, FilterState } from './BoltResultsFilter';

// type CompanyType = GetCompanyQuery['company'];
// type SiteType = NonNullable<CompanyType['sites']>[number];
// type LevelType = NonNullable<SiteType['levels']>[number];
// type DriveType = NonNullable<LevelType['drives']>[number];
// type LocationType = NonNullable<DriveType['locations']>[number];

interface BoltSelectionProps {
  site?: Site;
  level?: Level;
  drive?: Drive;
  location?: Location;
  dateRange?: DateRange;
  selectedTab?: string;
  filterState: FilterState;
  onSetSite: React.Dispatch<React.SetStateAction<Site | undefined>>;
  onSetLevel: React.Dispatch<React.SetStateAction<Level | undefined>>;
  onSetDrive: React.Dispatch<React.SetStateAction<Drive | undefined>>;
  onSetLocation: React.Dispatch<React.SetStateAction<Location | undefined>>;
  onSetDateRange: (dateRange: DateRange | undefined) => void;
  onFilterChange: (filters: FilterState) => void;
  boltResults: BoltResult[];
  companyData: GetCompanyQuery;
}

export const BoltSelection = ({
  companyData,
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
    return companyData?.company?.sites || [];
  }, [companyData]);

  const handleSetSite = (siteId?: string) => {
    const selectedSite = companyData?.company?.sites?.find(
      (s) => s.id === siteId,
    );
    onSetSite(selectedSite as Site | undefined);
    onSetDateRange({ from: undefined, to: undefined });
    onSetLevel(undefined);
    onSetDrive(undefined);
    onSetLocation(undefined);
  };

  // const levelsOptions = useMemo(() => {
  //   return site?.levels || [];
  // }, [site]);

  const levelsOptions = useMemo(() => {
    return (
      site?.levels?.map((level) => ({
        id: level.id,
        name: level.levelName, // or whatever property contains the level name
      })) || []
    );
  }, [site]);
  const handleSetLevel = (levelId?: string) => {
    const selectedLevel = site?.levels?.find((l) => l.id === levelId);
    onSetLevel(selectedLevel as Level | undefined);
    onSetDrive(undefined);
    onSetLocation(undefined);
  };

  const drivesOptions = useMemo(() => {
    return (
      level?.drives?.map((drive) => ({
        id: drive.id,
        name: drive.driveName, // or whatever property contains the drive name
      })) || []
    );
  }, [level]);

  const handleSetDrive = (driveId?: string) => {
    const selectedDrive = level?.drives?.find((d) => d.id === driveId);
    onSetDrive(selectedDrive);
    onSetLocation(undefined);
  };

  const locationsOptions = useMemo(() => {
    return (
      drive?.locations?.map((location) => ({
        id: location.id,
        name: location.locationName, // or whatever property contains the location name
      })) || []
    );
  }, [drive]);

  console.log('levelsOptions', levelsOptions);
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
              onSetDateRange(range);
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
            const selectedLocation = drive?.locations?.find(
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
