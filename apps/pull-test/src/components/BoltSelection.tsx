import { useMemo } from 'react';
import {
  ContentHolder,
  DateRange,
  Dropdown,
  Label,
  RangeCalendar,
} from '@gsp/ui';
import { BoltResultsFilter, FilterState } from './BoltResultsFilter';
import { BoltResultSchema } from '@/app/mock/mock';
import { gql, useQuery } from 'urql';

interface Location {
  id: string;
  name: string;
}

interface Drive {
  id: string;
  name: string;
  locations: Location[];
}

interface Level {
  id: string;
  name: string;
  drives: Drive[];
}

interface Site {
  id: string;
  name: string;
  levels: Level[];
}

interface Company {
  sites: Site[];
}

interface CompanyData {
  company: Company;
}

interface BoltSelectionProps {
  companyId: string;
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
  onSetDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  onFilterChange: (filters: FilterState) => void;
  boltResults: BoltResultSchema[];
  compnayIdCompanyDetails?: CompanyData;
}

export const BoltSelection = ({
  companyId,
  // compnayIdCompanyDetails,
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
  const getCompanyQuery = gql`
    query GetCompany($id: String!) {
      company(id: $id) {
        sites {
          id
          name: siteName
          levels {
            id
            name: levelName
            drives {
              id
              name: driveName
              locations {
                id
                name: locationName
              }
            }
          }
        }
      }
    }
  `;

  const [{ data: compnayIdCompanyDetails }] = useQuery<CompanyData>({
    query: getCompanyQuery,
    variables: { id: companyId },
  });

  const siteOptions = useMemo(() => {
    return (
      compnayIdCompanyDetails?.company.sites.map((site) => ({
        id: site.id,
        name: site.name,
        levels: site.levels,
      })) || []
    );
  }, [compnayIdCompanyDetails]);

  const handleSetSite = (siteId?: string) => {
    const selectedSite = siteOptions.find((s) => s.id === siteId);
    onSetSite(selectedSite);
    onSetDateRange({ from: undefined, to: undefined });
    onSetLevel(undefined);
    onSetDrive(undefined);
    onSetLocation(undefined);
  };

  const levelsOptions = useMemo(() => {
    return (
      site?.levels.map((level) => ({
        id: level.id,
        name: level.name,
        drives: level.drives,
      })) || []
    );
  }, [site]);

  const handleSetLevel = (levelId?: string) => {
    const selectedLevel = levelsOptions.find((l) => l.id === levelId);
    onSetLevel(selectedLevel);
    onSetDrive(undefined);
    onSetLocation(undefined);
  };

  const drivesOptions = useMemo(() => {
    return (
      level?.drives.map((drive) => ({
        id: drive.id,
        name: drive.name,
        locations: drive.locations,
      })) || []
    );
  }, [level]);

  const handleSetDrive = (driveId?: string) => {
    const selectedDrive = drivesOptions.find((d) => d.id === driveId);
    onSetDrive(selectedDrive);
    onSetLocation(undefined);
  };

  const locationsOptions = useMemo(() => {
    return (
      drive?.locations.map((location) => ({
        id: location.id,
        name: location.name,
      })) || []
    );
  }, [drive]);

  return (
    <ContentHolder variant="filter">
      <BoltResultsFilter
        selectedTab={selectedTab}
        onFilterChange={onFilterChange}
      />

      <div className="space-y-1.5 mt-0.5">
        <Label htmlFor="site">Site</Label>
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
        <Label htmlFor="level">Level</Label>
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
        <Label htmlFor="drive">Drive</Label>
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
        <Label htmlFor="location">Location</Label>
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
