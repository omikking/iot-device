'use client';
import {
  Anchor,
  Badge,
  Button,
  Dropdown,
  Headline,
  Text,
  DropdownItem,
  Form,
  FormField,
  FormItem,
  FormControl,
  Input,
  FormMessage,
} from '@gsp/ui';
import { sitesMock } from './mock.ts';
import {
  LucideEllipsis,
  LucideMoveLeft,
  LucideCircleCheckBig,
  LucideX,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
  const [drivesOptionsMock, setDrivesOptionsMock] = useState<IDriveMock[]>([]);
  const [positionsOptionsMock, setPositionsOptionsMock] = useState<
    IPositionMock[]
  >([]);
  const handleLevelClick = (level: string, index: number) => {
    console.log('level', level);
    console.log('Levels index', index);
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
        id:
          prevLevel.length > 0
            ? (parseInt(prevLevel[prevLevel.length - 1].id, 10) + 1).toString()
            : '1',
        name: '',
        drives: [],
      },
    ]);
    console.log('levelsOptionsMock', levelsOptionsMock);
  };

  const addDriveHandler = () => {
    setDrivesOptionsMock((prevDrive) => [
      ...prevDrive,
      {
        id: '',
        name: '',
        positions: [],
      },
    ]);
  };

  const addPositionHandler = () => {
    setPositionsOptionsMock((prevPosition) => [
      ...prevPosition,
      {
        id: '',
        name: '',
      },
    ]);
  };

  const handleSubmitLevel = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newLevelName = formData.get('level') as string;

    // Check for duplicate levels
    const isDuplicate = levelsOptionsMock.some(
      (level) => level.name.toLowerCase() === newLevelName.toLowerCase(),
    );

    if (isDuplicate) {
      alert('This level already exists. Please enter a different level.');
      return;
    }

    const newLevel = {
      id: formData.get('level') as string,
      name: formData.get('level') as string,
      drives: [],
    };

    const newLevelsList = [...levelsOptionsMock];
    newLevelsList[index] = newLevel;
    setLevelsOptionsMock(newLevelsList);
    console.log('newLevelsList', newLevelsList);
  };

  const handleSubmitDrive = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newDriveName = formData.get('drive') as string;
    const isDuplicate = drivesOptionsMock.some(
      (drive) => drive.name === newDriveName,
    );
    if (isDuplicate) {
      alert('This drive already exists. Please enter a different drive.');
      return;
    }
    const newDrive = {
      id: formData.get('drive') as string,
      name: formData.get('drive') as string,
      positions: [],
    };
    const newDrives = [...drivesOptionsMock];
    newDrives[index] = newDrive;
    setDrivesOptionsMock(newDrives);
    console.log('newDrives', newDrives);
  };

  const handleSubmitPosition = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newPositionName = formData.get('position') as string;
    const isDuplicate = positionsOptionsMock.some(
      (position) => position.name === newPositionName,
    );
    if (isDuplicate) {
      alert('This position already exists. Please enter a different position.');
      return;
    }
    const newPosition = {
      id: formData.get('position') as string,
      name: formData.get('position') as string,
    };
    const newPositions = [...positionsOptionsMock];
    newPositions[index] = newPosition;
    setPositionsOptionsMock(newPositions);
    console.log('newPositions', newPositions);
  };

  const handleCancel = (
    event: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    event.preventDefault();
    console.log('HANDLE REMOVE INDEX', index);

    const newLevels = [...levelsOptionsMock];
    newLevels.splice(index, 1);
    setLevelsOptionsMock(newLevels);

    console.log('newLevels', newLevels);
  };

  useEffect(() => {
    const levels =
      sitesMock.find((boltSites) => boltSites.name === site)?.levels || [];

    setLevelsOptionsMock(levels);
  }, [site]);

  useEffect(() => {
    const drives =
      levelsOptionsMock?.find((boltLevels) => boltLevels.name === level)
        ?.drives || [];

    setDrivesOptionsMock(drives);
  }, [level]);

  useEffect(() => {
    const positions =
      drivesOptionsMock?.find((boltDrives) => boltDrives.name === drive)
        ?.positions || [];

    setPositionsOptionsMock(positions);
  }, [drive]);

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
              {/* LEVELS */}
              {levelsOptionsMock?.length === 0 && (
                <div className="flex h-full  justify-center items-center">
                  <Text variant="small" color="foreground">
                    Select site to view available levels
                  </Text>
                </div>
              )}
              {levelsOptionsMock?.map((level, index) => (
                <div
                  className={`bg-main-white px-6  ${selectedLevel === level.id ? 'border-2 border-blue-primary ' : ''}`}
                  key={index}
                >
                  <div
                    className="py-5"
                    onClick={() => (
                      handleSetLevel(level.name),
                      handleLevelClick(level.id, index)
                    )}
                  >
                    {level.name === '' ? (
                      <div>
                        <form
                          onSubmit={(e) => handleSubmitLevel(e, index)}
                          className="flex flex-row w-full justify-between items-center"
                        >
                          <input
                            className="w-full focus:border-blue-primary focus:outline focus:outline-none"
                            name="level"
                            placeholder="New level..."
                            // we want to update the value inside of newLevels array, so we need to use onChange to update name value
                            onChange={(e) => {
                              console.log('e.target.value', e.target.value);
                              const newLevels = [...levelsOptionsMock];
                              newLevels[index].name = e.target.value;
                              // setLevelsOptionsMock(newLevels);
                            }}
                          />
                          <Button
                            size={'small'}
                            variant={'outline'}
                            type="button"
                            onClick={(event) => handleCancel(event, index)}
                          >
                            <LucideX />
                          </Button>
                          <Button
                            size={'small'}
                            variant={'primary'}
                            type="submit"
                          >
                            <LucideCircleCheckBig />
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
                          size={'small'}
                          variant={'outline'}
                          type="button"
                          onClick={(event) => handleCancel(event, index)}
                        >
                          <LucideX />
                        </Button>
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
              {/* DRIVES */}
              {drivesOptionsMock?.length === 0 && (
                <div className="flex h-full  justify-center items-center">
                  <Text variant="small" color="foreground">
                    Select level to view available drives
                  </Text>
                </div>
              )}
              {drivesOptionsMock?.map((drive, index) => (
                <div
                  className={`bg-main-white px-6  ${selectedDrive === drive.id ? 'border border-blue-primary ' : ''}`}
                >
                  <div
                    className="py-5"
                    onClick={() => (
                      handleSetDrive(drive.name), handleDriveClick(drive.id)
                    )}
                  >
                    {drive.name === '' ? (
                      <div>
                        <form
                          onSubmit={(e) => handleSubmitDrive(e, index)}
                          className="flex flex-row w-full justify-between items-center"
                        >
                          <input name="drive" placeholder="New drive..." />
                          <Button
                            size={'small'}
                            variant={'primary'}
                            type="submit"
                          >
                            <LucideCircleCheckBig />
                            Save
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <div className="flex flex-row w-full justify-between items-center">
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
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end w-full p-3">
              {level !== undefined ? (
                <Button
                  size={'small'}
                  variant={'primary'}
                  onClick={() => addDriveHandler()}
                >
                  <Text variant={'small'} color={'background'}>
                    + Add drive
                  </Text>
                </Button>
              ) : (
                <Button size={'small'} variant={'primary'} disabled>
                  <Text variant={'small'} color={'background'}>
                    + Add drive
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
              {/* POSITIONS */}
              {positionsOptionsMock?.length === 0 && (
                <div className="flex h-full  justify-center items-center">
                  <Text variant="small" color="foreground">
                    Select drive to view available positions
                  </Text>
                </div>
              )}
              {positionsOptionsMock?.map((position, index) => (
                <div
                  className={`bg-main-white px-6  ${selectedPosition === position.id ? 'border border-blue-primary ' : ''}`}
                >
                  <div
                    className="py-5"
                    onClick={() => {
                      handlePositionClick(position.id),
                        handleSetPoisiton(position.name);
                    }}
                  >
                    {position.name === '' ? (
                      <div>
                        <form
                          onSubmit={(e) => handleSubmitPosition(e, index)}
                          className="flex flex-row w-full justify-between items-center"
                        >
                          <input
                            name="position"
                            placeholder="New position..."
                          />
                          <Button
                            size={'small'}
                            variant={'primary'}
                            type="submit"
                          >
                            <LucideCircleCheckBig />
                            Save
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <div className="flex flex-row w-full justify-between items-center">
                        <Text variant="small" color="foreground">
                          {position.name}
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
              {drive !== undefined ? (
                <Button
                  size={'small'}
                  variant={'primary'}
                  onClick={() => addPositionHandler()}
                >
                  <Text variant={'small'} color={'background'}>
                    + Add position
                  </Text>
                </Button>
              ) : (
                <Button size={'small'} variant={'primary'} disabled>
                  <Text variant={'small'} color={'background'}>
                    + Add position
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
