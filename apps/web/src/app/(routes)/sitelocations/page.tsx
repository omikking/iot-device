'use client';
import React, { useEffect, useState } from 'react';
import {
  Anchor,
  Badge,
  Dropdown,
  Headline,
  Text,
  DropdownItem,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from '@gsp/ui';
import Link from 'next/link';
import { LucideMoveLeft } from 'lucide-react';
import { LevelsList } from '@/components/SiteLocations/levels/LevelsList';
import { DrivesList } from '@/components/SiteLocations/drive/DrivesList';
import { LocationsList } from '@/components/SiteLocations/locations/LocationList';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { graphql } from '@/gql';
import { Drive, Level, Location, Site } from '@/gql/graphql';
import { useQuery } from 'urql';

const getCompanySitesNameQuery = graphql(`
  query getCompanySitesNames($id: String!) {
    company(id: $id) {
      sites {
        id
        siteName
      }
    }
  }
`);

const getFullSiteLocationsQuery = graphql(`
  query getFullSiteLocations($id: String!) {
    site(id: $id) {
      id
      siteName
      levels {
        id
        levelName
        siteId
        drives {
          id
          driveName
          levelId
          locations {
            id
            driveId
            locationName
          }
        }
      }
    }
  }
`);

export default function Page(): JSX.Element {
  const { data: session } = useSession();

  const [selectedSite, setSelectedSite] = useState<Site | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>();
  const [selectedDrive, setSelectedDrive] = useState<Drive | undefined>();

  const [levelsOptions, setLevelsOptions] = useState<Level[]>([]);
  const [drivesOptions, setDrivesOptions] = useState<Drive[]>([]);
  const [locationsOptions, setLocationsOptions] = useState<Location[]>([]);

  console.log(selectedLevel);
  console.log(levelsOptions);

  // Request all sites of company for dropdown
  const [sitesData] = useQuery({
    query: getCompanySitesNameQuery,
    variables: { id: session?.company?.id || '' },
    pause: !session?.company?.id,
  });
  const sites = (sitesData.data?.company.sites as Site[]) || [];

  const sitesOptions: DropdownItem[] = sites.map((site) => ({
    id: site.id,
    name: site.siteName,
  }));

  // Request the selected full site data (level, drive, location)
  const [siteData] = useQuery({
    query: getFullSiteLocationsQuery,
    variables: { id: selectedSite?.id || '' },
    pause: !selectedSite?.id,
  });
  const site = (siteData.data?.site as Site) || [];

  // When the full site is fetched, set levels, drives, and locations.
  useEffect(() => {
    if (site) {
      if (site.levels) {
        setLevelsOptions(site.levels);
      }
      setDrivesOptions([]);
      setLocationsOptions([]);
    }
  }, [site]);

  // Set site from url
  const searchParams = useSearchParams();
  const siteIdFromUrl = searchParams.get('site');
  const siteFromUrl = sites.find((site) => site.id === siteIdFromUrl);

  useEffect(() => {
    if (siteFromUrl) {
      setSelectedSite(siteFromUrl);
    }
  }, [siteFromUrl]);

  const handleSetSite = (siteId?: string) => {
    const site = sites.find((site) => site.id === siteId);
    setSelectedSite(site);
    setSelectedLevel(undefined);
    setSelectedDrive(undefined);
    setDrivesOptions([]);
    setLocationsOptions([]);
  };

  const handleSetLevel = (levelId?: string) => {
    console.log(levelId);
    console.log('set level');
    const level = levelsOptions.find((level) => level.id === levelId);
    setSelectedLevel(level);
    setSelectedDrive(undefined);
    setLocationsOptions([]);

    const drives =
      levelsOptions?.find((level) => level.id === levelId)?.drives || [];
    setDrivesOptions(drives);
  };

  const handleSetDrive = (driveId?: string) => {
    const drive = drivesOptions.find((drive) => drive.id === driveId);
    setSelectedDrive(drive);

    const locations =
      drivesOptions?.find((drive) => drive.id === driveId)?.locations || [];
    setLocationsOptions(locations);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-main-white">
      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10 group"
      >
        <Link href="/overview" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-[-4px]" />
            Go back
          </Anchor>
        </Link>
      </Text>

      {session?.company.name && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {session.company.name}
        </Badge>
      )}

      <Headline as="h1" variant="xl" color="foreground">
        Site locations
      </Headline>

      <div className="flex w-full flex-col gap-5">
        <div className="flex items-center gap-10">
          <Dropdown
            id="site"
            placeholder="Select site"
            selectedId={selectedSite?.id}
            options={sitesOptions}
            onSelect={handleSetSite}
            className="w-96"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {selectedSite && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Text variant="medium" color="foreground">
                      {selectedSite.siteName}
                    </Text>
                  </BreadcrumbItem>
                </>
              )}
              {selectedLevel && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Text variant="medium" color="foreground">
                      {selectedLevel.levelName}
                    </Text>
                  </BreadcrumbItem>
                </>
              )}
              {selectedDrive && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Text variant="medium" color="foreground">
                      {selectedDrive.driveName}
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
              levelsOptions={levelsOptions}
              selectedLevelId={selectedLevel?.id}
              selectedSiteId={selectedSite?.id}
              handleSetLevel={handleSetLevel}
              setLevelsOptions={setLevelsOptions}
              setDrivesOptions={setDrivesOptions}
              setLocationsOptions={setLocationsOptions}
            />
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center border-x">
            <DrivesList
              drivesOptions={drivesOptions}
              selectedDriveId={selectedDrive?.id}
              selectedLevelId={selectedLevel?.id}
              levelsOptions={levelsOptions}
              setDrivesOptions={setDrivesOptions}
              setLocationsOptions={setLocationsOptions}
              handleSetDrive={handleSetDrive}
            />
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
            <LocationsList
              selectedDriveId={selectedDrive?.id}
              drivesOptions={drivesOptions}
              locationsOptions={locationsOptions}
              setLocationsOptions={setLocationsOptions}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
