'use client';
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
import React, { useState } from 'react';
import { sitesMock } from '@/app/mock/mock';
import { LucideMoveLeft } from 'lucide-react';
import { LevelsList } from '@/components/SiteLocations/levels/LevelsList';
import { DrivesList } from '@/components/SiteLocations/drive/DrivesList';
import { PositionsList } from '@/components/SiteLocations/positions/PositionsList';
import { useSearchParams } from 'next/navigation';

export interface ISiteMock {
  id: string;
  name: string;
  levels: ILevelMock[];
}

export interface ILevelMock {
  id: string;
  name: string;
  drives: IDriveMock[];
}

export interface IDriveMock {
  id: string;
  name: string;
  positions: IPositionMock[];
}

export interface IPositionMock {
  id: string;
  name: string;
}

export default function Page(): JSX.Element {
  const searchParams = useSearchParams();
  const siteTableValue = searchParams.get('data');
  const siteFromUrl = sitesMock.find((site) => site.name === siteTableValue);

  const levelsFromUrlSite =
    sitesMock.find((boltSites) => boltSites.name === siteFromUrl?.name)
      ?.levels || [];

  const [selectedSite, setSelectedSite] = useState<string | undefined>(
    siteFromUrl?.id,
  );

  const [selectedSiteName, setSelectedSiteName] = useState<string | undefined>(
    siteFromUrl?.name,
  );

  const [selectedLevel, setSelectedLevel] = useState<string | undefined>();
  const [selectedDrive, setSelectedDrive] = useState<string | undefined>();

  const [levelsOptionsMock, setLevelsOptionsMock] =
    useState<ILevelMock[]>(levelsFromUrlSite);
  const [drivesOptionsMock, setDrivesOptionsMock] = useState<IDriveMock[]>([]);
  const [positionsOptionsMock, setPositionsOptionsMock] = useState<
    IPositionMock[]
  >([]);

  const handleSetSite = (site?: string) => {
    setSelectedSite(site);
    setSelectedSiteName(site);
    setSelectedLevel(undefined);
    setSelectedDrive(undefined);
    setDrivesOptionsMock([]);
    setPositionsOptionsMock([]);

    const levels =
      sitesMock.find((boltSites) => boltSites.name === site)?.levels || [];
    setLevelsOptionsMock(levels);
  };

  const handleSetLevel = (level?: string) => {
    setSelectedLevel(level);
    setSelectedDrive(undefined);
    setPositionsOptionsMock([]);

    const drives =
      levelsOptionsMock?.find((boltLevels) => boltLevels.name === level)
        ?.drives || [];
    setDrivesOptionsMock(drives);
  };

  const handleSetDrive = (drive?: string) => {
    setSelectedDrive(drive);

    const positions =
      drivesOptionsMock?.find((boltDrives) => boltDrives.name === drive)
        ?.positions || [];
    setPositionsOptionsMock(positions);
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
      <Badge variant="primary" size="large" className="absolute top-24">
        {selectedSiteName || 'Select site'}
      </Badge>
      <Headline as="h1" variant="xl" color="foreground">
        Site locations
      </Headline>

      <div className="flex w-full flex-col gap-5">
        <div className="flex items-center gap-10">
          <Dropdown
            id="site"
            placeholder="Select site"
            selectedId={selectedSite}
            options={sitesMock as DropdownItem[]}
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
                      {selectedSite}
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
              levelsOptionsMock={levelsOptionsMock}
              selectedLevel={selectedLevel}
              selectedSite={selectedSite}
              handleSetLevel={handleSetLevel}
              setLevelsOptionsMock={setLevelsOptionsMock}
              setDrivesOptionsMock={setDrivesOptionsMock}
              setPositionsOptionsMock={setPositionsOptionsMock}
            />
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center border-x">
            <DrivesList
              drivesOptionsMock={drivesOptionsMock}
              selectedDrive={selectedDrive}
              selectedLevel={selectedLevel}
              levelsOptionsMock={levelsOptionsMock}
              setDrivesOptionsMock={setDrivesOptionsMock}
              setPositionsOptionsMock={setPositionsOptionsMock}
              handleSetDrive={handleSetDrive}
            />
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
            <PositionsList
              selectedDrive={selectedDrive}
              drivesOptionsMock={drivesOptionsMock}
              positionsOptionsMock={positionsOptionsMock}
              setPositionsOptionsMock={setPositionsOptionsMock}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
