'use client';
import {
  Anchor,
  Badge,
  Button,
  Dropdown,
  Headline,
  Text,
  DropdownItem,
} from '@gsp/ui';
import { sitesMock } from './mock.ts';
import { LucideEllipsis, LucideMoveLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface ILevelMock {
  id: string;
  name: string;
  drives: IDriveMock[];
}

interface IDriveMock {
  id: string;
  name: string;
  positions: IPositionMock[];
}

interface IPositionMock {
  id: string;
  name: string;
}

export default function Page(): JSX.Element {
  const [site, setSite] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [drive, setDrive] = useState<string | undefined>(undefined);
  const [position, setPosition] = useState<string | undefined>(undefined);
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(
    undefined,
  );
  const [selectedDrive, setSelectedDrive] = useState<string | undefined>(
    undefined,
  );
  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(
    undefined,
  );

  const [levelsOptionsMock, setLevelsOptionsMock] = useState<ILevelMock[]>([]);

  const handleLevelClick = (level: string) => {
    console.log('level', level);
    setSelectedLevel(level);
  };
  const handleDriveClick = (drive: string) => {
    setSelectedDrive(drive);
  };
  const handlePositionClick = (position: string) => {
    setSelectedPosition(position);
  };

  const handleSetSite = (site?: string) => {
    setSite(site);
    setLevel(undefined);
    setDrive(undefined);
    setPosition(undefined);
  };

  const handleSetLevel = (level?: string) => {
    setLevel(level);
    setDrive(undefined);
    setPosition(undefined);
    setSelectedDrive(undefined);
  };

  const handleSetDrive = (drive?: string) => {
    setDrive(drive);
    setPosition(undefined);
    setSelectedPosition(undefined);
  };

  const handleSetPoisiton = (position?: string) => {
    setPosition(position);
  };

  const addLevelHandler = () => {
    setLevelsOptionsMock((prevLevel) => [
      ...prevLevel,
      {
        id: '',
        name: '',
        drives: [],
      },
    ]);
  };

  // Finds available levels on the selected site
  const drivesOptionsMock = levelsOptionsMock?.find(
    (boltLevels) => boltLevels.name === level,
  )?.drives;

  const positionsOptionsMock = drivesOptionsMock?.find(
    (boltDrives) => boltDrives.name === drive,
  )?.positions;

  const handleSubmitLevel = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newLevel = {
      id: formData.get('level') as string,
      name: formData.get('level') as string,
      drives: [],
    };
    const newLevels = [...levelsOptionsMock];
    newLevels[index] = newLevel;
    setLevelsOptionsMock(newLevels);
    console.log('newLevels', newLevels);

    // setLevelsOptionsMock((prevLevel) => [
    //   ...prevLevel,
    //   {
    //     id: formData.get('level') as string,
    //     name: formData.get('level') as string,
    //     drives: [],
    //   },
    // ]);
  };

  useEffect(() => {
    const levels =
      sitesMock.find((boltSites) => boltSites.name === site)?.levels || [];

    setLevelsOptionsMock(levels);
  }, [site]);

  useEffect(() => {
    // console.log('levelsOptionsMock', levelsOptionsMock);
  }, [levelsOptionsMock]);

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
        Select site
      </Badge>
      <Headline as="h1" variant="xl" color="foreground">
        Sites locations
      </Headline>

      <div className="flex w-full flex-col gap-5">
        <Dropdown
          id="site"
          placeholder="Select site"
          selectedId={site}
          options={sitesMock as DropdownItem[]}
          onSelect={handleSetSite}
          className="w-[400px]"
        />

        <div className="flex w-fll max-w-[1320px] h-[740px] justify-around items-center bg-neutral-1 border-2">
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
            <div className="flex flex-row w-full p-6">
              <Headline as="h2" variant="smallBold" color="foreground">
                Levels
              </Headline>
            </div>
            <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
              {levelsOptionsMock?.map((level, index) => (
                <div
                  className={`bg-main-white px-6  ${selectedLevel === level.id ? 'border border-blue-primary ' : ''}`}
                >
                  <div
                    className=" py-5"
                    onClick={() => (
                      handleSetLevel(level.name), handleLevelClick(level.id)
                    )}
                  >
                    {level.name === '' ? (
                      <div className="flex flex-row w-full justify-between items-center">
                        <form onSubmit={(e) => handleSubmitLevel(e, index)}>
                          <input name="level" placeholder="New level..." />
                          <Button
                            size={'small'}
                            variant={'primary'}
                            type="submit"
                          >
                            Save
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <div className="flex flex-row w-full justify-between items-center">
                        <Text variant="small" color="foreground">
                          {level.name}
                        </Text>
                        <Button
                          onClick={(event) => (
                            console.log('second'), event.stopPropagation()
                          )}
                          size={'small'}
                          variant={'outline'}
                        >
                          <LucideEllipsis />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end w-full p-3">
              {site !== undefined ? (
                <Button
                  size={'small'}
                  variant={'primary'}
                  onClick={() => addLevelHandler()}
                >
                  <Text variant={'small'} color={'background'}>
                    + Add level
                  </Text>
                </Button>
              ) : (
                <Button size={'small'} variant={'primary'} disabled>
                  <Text variant={'small'} color={'background'}>
                    + Add level
                  </Text>
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center border-x">
            <div className="flex flex-row w-full p-6 ">
              <Headline as="h2" variant="smallBold" color="foreground">
                Drives
              </Headline>
            </div>
            <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
              {drivesOptionsMock?.map((drive) => (
                <div
                  className={`bg-main-white px-6  ${selectedDrive === drive.id ? 'border border-blue-primary ' : ''}`}
                >
                  <div
                    className="flex flex-row justify-between items-center py-5"
                    onClick={() => (
                      console.log('first'),
                      handleSetDrive(drive.name),
                      handleDriveClick(drive.id)
                    )}
                  >
                    <Text variant="small" color="foreground">
                      {drive.name}
                    </Text>

                    <Button
                      onClick={(event) => (
                        console.log('second'), event.stopPropagation()
                      )}
                      size={'small'}
                      variant={'outline'}
                    >
                      <LucideEllipsis />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end w-full p-3">
              {level !== undefined ? (
                <Button size={'small'} variant={'primary'}>
                  <Text variant={'small'} color={'background'}>
                    + Add level
                  </Text>
                </Button>
              ) : (
                <Button size={'small'} variant={'primary'} disabled>
                  <Text variant={'small'} color={'background'}>
                    + Add level
                  </Text>
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
            <div className="flex flex-row w-full p-6">
              <Headline as="h2" variant="smallBold" color="foreground">
                Positions
              </Headline>
            </div>
            <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
              {positionsOptionsMock?.map((position) => (
                <div
                  className={`bg-main-white px-6  ${selectedPosition === position.id ? 'border border-blue-primary ' : ''}`}
                >
                  <div
                    className="flex flex-row justify-between items-center py-5"
                    onClick={() => {
                      handlePositionClick(position.id),
                        handleSetPoisiton(position.name);
                    }}
                  >
                    <Text variant="small" color="foreground">
                      {position.name}
                    </Text>
                    <Button size={'small'} variant={'outline'}>
                      <LucideEllipsis />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end w-full p-3">
              {drive !== undefined ? (
                <Button size={'small'} variant={'primary'}>
                  <Text variant={'small'} color={'background'}>
                    + Add level
                  </Text>
                </Button>
              ) : (
                <Button size={'small'} variant={'primary'} disabled>
                  <Text variant={'small'} color={'background'}>
                    + Add level
                  </Text>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
