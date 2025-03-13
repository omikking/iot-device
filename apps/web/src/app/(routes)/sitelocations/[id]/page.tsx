'use client';
import {
  Text,
  Badge,
  Dropdown,
  Headline,
  Breadcrumb,
  DropdownItem,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from '@gsp/ui';
import {
  ISite,
  useSite,
  useSites,
} from '@/components/urql-siteslocations/SitesLocationsUrql';
import React, { useState } from 'react';
import { GoBack } from '@/components/GoBack';
import { useParams, useSearchParams } from 'next/navigation';
import { DrivesList } from '@/components/SiteLocations/drive/DrivesList';
import { LevelsList } from '@/components/SiteLocations/levels/LevelsList';
import { LocationsList } from '@/components/SiteLocations/locations/LocationList';
import { CompanyNameUrql } from '@/components/urql-selectapplications/SelectApplicationUrql';

export default function Page(): JSX.Element {
  const params = useParams();
  const companyId = params.id as string;
  const searchParams = useSearchParams();
  const siteTableValue = searchParams.get('data');
  // fetch sites
  const { sites } = useSites();
  // Find the site that matches the sitename from url
  const siteFromUrl = sites.find((site) => site.siteName === siteTableValue);

  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>(
    siteFromUrl?.id,
  );

  const [selectedSiteName, setSelectedSiteName] = useState<string | undefined>(
    siteFromUrl?.siteName,
  );

  const [selectedLevel, setSelectedLevel] = useState<string | undefined>();
  const [selectedDrive, setSelectedDrive] = useState<string | undefined>();

  // get site by name by selected site
  const foundSite = sites.find((site) => site.siteName === selectedSiteName);
  // get site by id
  const { site, refetchSite } = useSite(foundSite?.id || '');
  const levels = site?.levels;

  const drives = levels?.find(
    (level) => level.levelName === selectedLevel,
  )?.drives;

  const locations = drives?.find(
    (drive) => drive.driveName === selectedDrive,
  )?.locations;

  // Function would be nice to have in utils or helper
  const getSiteDropdownOptions = (sites: ISite[]): DropdownItem[] => {
    return sites.map((site) => ({
      id: site.id,
      name: site.siteName,
    }));
  };

  const handleSetSite = (siteName?: string) => {
    const site = sites.find((s) => s.siteName === siteName);
    setSelectedSiteId(site?.id);
    setSelectedSiteName(site?.siteName);
    setSelectedLevel(undefined);
    setSelectedDrive(undefined);
  };

  const handleSetLevel = (level?: string) => {
    setSelectedLevel(level);
    setSelectedDrive(undefined);
  };

  const handleSetDrive = (drive?: string) => {
    setSelectedDrive(drive);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-main-white">
      <GoBack />
      <Badge variant="primary" size="large" className="absolute top-24">
        <CompanyNameUrql companyId={companyId} />
      </Badge>
      <Headline as="h1" variant="xl" color="foreground">
        Site locations
      </Headline>

      <div className="flex w-full flex-col gap-5">
        <div className="flex items-center gap-10">
          <Dropdown
            id="site"
            placeholder="Select site"
            selectedId={selectedSiteId}
            options={getSiteDropdownOptions(sites) as DropdownItem[]}
            onSelect={handleSetSite}
            className="w-96"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {selectedSiteName && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Text variant="medium" color="foreground">
                      {selectedSiteName}
                    </Text>
                  </BreadcrumbItem>
                </>
              )}
              {selectedLevel && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Text variant="medium" color="foreground">
                      {selectedLevel}
                    </Text>
                  </BreadcrumbItem>
                </>
              )}
              {selectedDrive && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Text variant="medium" color="foreground">
                      {selectedDrive}
                    </Text>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex w-fll max-w-[1320px] h-[740px] justify-around items-center bg-neutral-1 border-2">
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
            <LevelsList
              selectedLevel={selectedLevel}
              selectedSiteId={selectedSiteId}
              levelsOptions={levels || []}
              handleSetLevel={handleSetLevel}
              refetchSite={refetchSite}
            />
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center border-x">
            <DrivesList
              selectedDrive={selectedDrive}
              selectedLevel={selectedLevel}
              drivesOptions={drives || []}
              levelsOptions={levels || []}
              handleSetDrive={handleSetDrive}
              refetchSite={refetchSite}
            />
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
            <LocationsList
              selectedDrive={selectedDrive}
              drivesOptions={drives || []}
              locationsOptions={locations || []}
              refetchSite={refetchSite}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
