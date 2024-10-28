'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { sitesMock } from '@/app/mock/mock';
import { LevelsListComponent } from '@/components/sitelocationcomponents/levels/LevelsListComponent';

import { DrivesListComponent } from '@/components/sitelocationcomponents/drive/DrivesListComponent';
import { PositionsListComponent } from '@/components/sitelocationcomponents/positions/PositionsListComponent';
import { LucideMoveLeft } from 'lucide-react';
import { Anchor, Badge, Dropdown, Headline, Text, DropdownItem } from '@gsp/ui';

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
  const [selectedSite, setSelectedSite] = useState<string | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>();
  const [selectedDrive, setSelectedDrive] = useState<string | undefined>();

  const [levelsOptionsMock, setLevelsOptionsMock] = useState<ILevelMock[]>([]);
  const [drivesOptionsMock, setDrivesOptionsMock] = useState<IDriveMock[]>([]);
  const [positionsOptionsMock, setPositionsOptionsMock] = useState<
    IPositionMock[]
  >([]);

  // Handles when site is selected in dropdown
  const handleSetSite = (site?: string) => {
    setSelectedSite(site);
    setSelectedLevel(undefined);
    setSelectedDrive(undefined);

    const levels =
      sitesMock.find((boltSites) => boltSites.name === site)?.levels || [];
    setLevelsOptionsMock(levels);
  };

  // Handles when level is selected in list
  const handleSetLevel = (level?: string) => {
    setSelectedLevel(level);
    setSelectedDrive(undefined);

    const drives =
      levelsOptionsMock?.find((boltLevels) => boltLevels.name === level)
        ?.drives || [];
    setDrivesOptionsMock(drives);
  };

  // Handles when drive is selected in list
  const handleSetDrive = (drive?: string) => {
    setSelectedDrive(drive);

    const positions =
      drivesOptionsMock?.find((boltDrives) => boltDrives.name === drive)
        ?.positions || [];
    setPositionsOptionsMock(positions);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10 group"
      >
        <Link href="/" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-[-4px]" />
            Go back
          </Anchor>
        </Link>
      </Text>
      <Badge variant="primary" size="large" className="absolute top-24">
        {selectedSite || 'Select site'}
      </Badge>
      <Headline as="h1" variant="xl" color="foreground">
        Site locations
      </Headline>

      <div className="flex w-full flex-col gap-5">
        <Dropdown
          id="site"
          placeholder="Select site"
          selectedId={selectedSite}
          options={sitesMock as DropdownItem[]}
          onSelect={handleSetSite}
          className="w-96"
        />

        <div className="flex w-fll max-w-[1320px] h-[740px] justify-around items-center bg-neutral-1 border-2">
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
            <LevelsListComponent
              levelsOptionsMock={levelsOptionsMock}
              selectedLevel={selectedLevel ?? ''}
              selectedSite={selectedSite}
              handleSetLevel={handleSetLevel}
              setLevelsOptionsMock={setLevelsOptionsMock}
              setDrivesOptionsMock={setDrivesOptionsMock}
              setPositionsOptionsMock={setPositionsOptionsMock}
            />
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center border-x">
            <DrivesListComponent
              drivesOptionsMock={drivesOptionsMock}
              selectedDrive={selectedDrive ?? ''}
              selectedLevel={selectedLevel}
              levelsOptionsMock={levelsOptionsMock}
              setDrivesOptionsMock={setDrivesOptionsMock}
              setPositionsOptionsMock={setPositionsOptionsMock}
              handleSetDrive={handleSetDrive}
            />
          </div>

          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
            <PositionsListComponent
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
