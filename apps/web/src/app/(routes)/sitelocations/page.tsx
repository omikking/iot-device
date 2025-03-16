'use client';
import React, { useEffect, useState, Suspense } from 'react';
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
import { Drive, Level, Site } from '@/gql/graphql';
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
  const [siteData, refreshSiteQuery] = useQuery({
    query: getFullSiteLocationsQuery,
    variables: { id: selectedSite?.id || '' },
    pause: !selectedSite?.id,
  });
  const site = (siteData.data?.site as Site) || [];

  const refreshSite = () => {
    refreshSiteQuery({ requestPolicy: 'network-only' });
  };

  // Set site from url
  const searchParams = useSearchParams();
  const siteIdFromUrl = searchParams.get('site');
  const siteFromUrl = sites.find((site) => site.id === siteIdFromUrl);

  useEffect(() => {
    if (siteFromUrl) {
      setSelectedSite(siteFromUrl);
    }
  }, [siteFromUrl]);

  const drives = site?.levels?.find(
    (level) => level.id === selectedLevel?.id,
  )?.drives;

  const locations = drives?.find(
    (drive) => drive.id === selectedDrive?.id,
  )?.locations;

  const handleSetSite = (siteId?: string) => {
    const site = sites.find((site) => site.id === siteId);
    setSelectedSite(site);
    setSelectedLevel(undefined);
    setSelectedDrive(undefined);
  };

  const handleSetLevel = (level?: Level) => {
    setSelectedLevel(level);
    setSelectedDrive(undefined);
  };

  const handleSetDrive = (drive?: Drive) => {
    setSelectedDrive(drive);
  };

  return (
    <Suspense>
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
              selectedId={site?.id}
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
          <div className="flex w-full max-w-[1320px] h-[740px] justify-around items-center bg-neutral-1 border-2">
            <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
              <LevelsList
                selectedLevelId={selectedLevel?.id}
                selectedSiteId={site?.id}
                levelsOptions={site.levels || []}
                handleSetLevel={handleSetLevel}
                refreshSite={refreshSite}
                setSelectedLevel={setSelectedLevel}
                setSelectedDrive={setSelectedDrive}
              />
            </div>
            <div className="flex flex-col min-w-72 w-full h-full justify-between items-center border-x">
              <DrivesList
                selectedDriveId={selectedDrive?.id}
                selectedLevelId={selectedLevel?.id}
                drivesOptions={drives || []}
                levelsOptions={site.levels || []}
                handleSetDrive={handleSetDrive}
                refreshSite={refreshSite}
                setSelectedDrive={setSelectedDrive}
              />
            </div>
            <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
              <LocationsList
                selectedDriveId={selectedDrive?.id}
                drivesOptions={drives || []}
                locationsOptions={locations || []}
                refreshSite={refreshSite}
              />
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
