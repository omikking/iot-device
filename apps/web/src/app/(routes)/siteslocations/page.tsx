'use client';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { sitesMock } from '@/app/mock/mock';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LucideEllipsis,
  LucideMoveLeft,
  LucideCircleCheckBig,
  LucideX,
  LucidePlus,
} from 'lucide-react';
import {
  Anchor,
  Badge,
  Button,
  Dropdown,
  Headline,
  Text,
  DropdownItem,
  Form,
  Input,
} from '@gsp/ui';

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

export const levelFormSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const driveFormSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const positionFormSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export default function Page(): JSX.Element {
  const levelForm = useForm<z.infer<typeof levelFormSchema>>({
    resolver: zodResolver(levelFormSchema),
    defaultValues: {
      id: '',
      name: '',
    },
  });

  const driveForm = useForm<z.infer<typeof driveFormSchema>>({
    resolver: zodResolver(driveFormSchema),
    defaultValues: {
      id: '',
      name: '',
    },
  });

  const positionForm = useForm<z.infer<typeof positionFormSchema>>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      id: '',
      name: '',
    },
  });

  const [site, setSite] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [drive, setDrive] = useState<string | undefined>(undefined);
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

  const handleSetSite = (site?: string) => {
    setSite(site);
    setLevel(undefined);
    setDrive(undefined);
  };

  const handleSetLevel = (level?: string) => {
    setLevel(level);
    setDrive(undefined);
    setSelectedDrive(undefined);
  };

  const handleSetDrive = (drive?: string) => {
    setDrive(drive);
    setSelectedPosition(undefined);
  };

  // Utility function to generate the next ID
  const generateNextId = (items: { id: string }[]): string => {
    return items.length > 0
      ? (parseInt(items[items.length - 1].id, 10) + 1).toString()
      : '1';
  };

  // Generic handler for adding an item
  const addItemHandler = <T extends { id: string; name: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    key: 'levels' | 'drives' | 'positions',
  ): void => {
    setter((prevItems) => [
      ...prevItems,
      {
        id: generateNextId(prevItems),
        name: '',
        ...(key === 'drives' && { drives: [] }),
        ...(key === 'positions' && { positions: [] }),
      } as T,
    ]);
  };

  const addLevel = () =>
    addItemHandler<ILevelMock>(setLevelsOptionsMock, 'levels');
  const addDrive = () =>
    addItemHandler<IDriveMock>(setDrivesOptionsMock, 'drives');
  const addPosition = () =>
    addItemHandler<IPositionMock>(setPositionsOptionsMock, 'positions');

  const handleSubmitLevel = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newLevelName = formData.get('level') as string;
    const isDuplicate = levelsOptionsMock.some(
      (level) => level.name.toLowerCase() === newLevelName.toLowerCase(),
    );

    const isDuplicateId = levelsOptionsMock.some(
      (level) =>
        level.id?.toLowerCase() === newLevelName.toLowerCase() &&
        level.name !== '',
    );

    if (isDuplicate || isDuplicateId) {
      alert('This level already exists. Please enter a different level.');
      return;
    }

    const newLevel = {
      ...levelsOptionsMock[index],
      name: formData.get('level') as string,
      drives: [],
    };

    const newLevelsList = [...levelsOptionsMock];
    newLevelsList[index] = newLevel;
    setLevelsOptionsMock(newLevelsList);

    const newSiteIndex = sitesMock.findIndex((s) => s.name === site);
    if (newSiteIndex !== -1) {
      const newSite = {
        ...sitesMock[newSiteIndex],
        levels: [...sitesMock[newSiteIndex].levels, newLevel],
      };
      const newSites = [...sitesMock];
      newSites[newSiteIndex] = newSite;
    }
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

    const isDuplicatedId = drivesOptionsMock.some(
      (drive) =>
        drive.id.toLowerCase() === newDriveName.toLowerCase() &&
        drive.name !== '',
    );

    if (isDuplicate || isDuplicatedId) {
      alert('This drive already exists. Please enter a different drive.');
      return;
    }

    const newDrive = {
      ...drivesOptionsMock[index],
      name: formData.get('drive') as string,
      positions: [],
    };
    const newDrives = [...drivesOptionsMock];
    newDrives[index] = newDrive;
    setDrivesOptionsMock(newDrives);
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

    const isDuplicateId = positionsOptionsMock.some(
      (position) =>
        position.id.toLowerCase() === newPositionName.toLowerCase() &&
        position.name !== '',
    );

    if (isDuplicate || isDuplicateId) {
      alert('This position already exists. Please enter a different position.');
      return;
    }
    const newPosition = {
      ...positionsOptionsMock[index],
      name: formData.get('position') as string,
    };
    const newPositions = [...positionsOptionsMock];
    newPositions[index] = newPosition;
    setPositionsOptionsMock(newPositions);
  };

  const handleCancelLevel = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.preventDefault();

    const newLevels = [...levelsOptionsMock];
    newLevels[index].drives = [];
    newLevels.splice(index, 1);
    setLevelsOptionsMock(newLevels);
  };

  const handleCancelDrive = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.preventDefault();

    const newDrives = [...drivesOptionsMock];
    newDrives[index].positions = [];
    newDrives.splice(index, 1);
    setDrivesOptionsMock(newDrives);
  };

  const handleCancelPosition = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.preventDefault();

    const newPositions = [...positionsOptionsMock];
    newPositions.splice(index, 1);
    setPositionsOptionsMock(newPositions);
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
      {site === undefined ? (
        <Badge variant="primary" size="large" className="absolute top-24">
          Select site
        </Badge>
      ) : (
        <Badge variant="primary" size="large" className="absolute top-24">
          {site}
        </Badge>
      )}
      <Headline as="h1" variant="xl" color="foreground">
        Site locations
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
          {/* @TODO Make a levelComponent */}
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
            <div className="flex flex-row w-full p-6">
              <Headline as="h2" variant="smallBold" color="foreground">
                Levels
              </Headline>
            </div>
            <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
              {/* LEVELS */}
              {levelsOptionsMock?.length === 0 && (
                <div className="flex h-full justify-center items-center">
                  <Text variant="small" color="foreground">
                    Select site to view available levels
                  </Text>
                </div>
              )}
              {levelsOptionsMock?.map((level, index) => (
                <div
                  className={`bg-main-white px-6  ${selectedLevel === level.id ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
                  key={index}
                >
                  <div
                    className="py-3"
                    onClick={() => (
                      handleSetLevel(level.name), setSelectedLevel(level.id)
                    )}
                  >
                    {/* @TODO Make a levelFormComponent */}
                    {level.name === '' ? (
                      <div>
                        <Form {...levelForm}>
                          <form
                            onSubmit={(e) => handleSubmitLevel(e, index)}
                            className="flex flex-row w-full justify-end items-center gap-2"
                          >
                            {/* @TODO fix the !modifier */}
                            <Input
                              className="flex w-full justify-self-start !h-full border-none"
                              name="level"
                              placeholder="New level..."
                            />

                            <Button
                              size={'small'}
                              variant={'outline'}
                              type="button"
                              onClick={(e) => handleCancelLevel(e, index)}
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
                        </Form>
                      </div>
                    ) : (
                      <div className="flex flex-row w-full justify-between items-center gap-2">
                        <Text
                          className="w-full"
                          variant="small"
                          color="foreground"
                        >
                          {level.name}
                        </Text>
                        {/* TODO: will remove this button later. Just here for testing purposes
                                    remove button will be inside the ellipsis button
                          */}
                        <Button
                          size={'small'}
                          variant={'outline'}
                          type="button"
                          onClick={(e) => handleCancelLevel(e, index)}
                        >
                          <LucideX />
                        </Button>
                        <Button
                          onClick={(e) => e.stopPropagation()}
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
              {site ? (
                <Button
                  size={'small'}
                  variant={'primary'}
                  onClick={() => addLevel()}
                  disabled={levelsOptionsMock.some(
                    (level) => level.name === '',
                  )}
                >
                  <LucidePlus /> Add level
                </Button>
              ) : (
                <Button size={'small'} variant={'primary'} disabled>
                  <LucidePlus /> Add level
                </Button>
              )}
            </div>
          </div>
          {/* @TODO Make a driveComponent */}
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
                  key={index}
                  className={`bg-main-white px-6  ${selectedDrive === drive.id ? 'border-2 border-blue-primary' : 'border-2 border-transparent'}`}
                >
                  <div
                    className="py-3"
                    onClick={() => (
                      handleSetDrive(drive.name), setSelectedDrive(drive.id)
                    )}
                  >
                    {drive.name === '' ? (
                      <div>
                        {/* @TODO Make a driveFormComponent */}
                        <Form {...driveForm}>
                          <form
                            onSubmit={(e) => handleSubmitDrive(e, index)}
                            className="flex flex-row w-full justify-between items-center gap-2"
                          >
                            <input
                              className="w-full focus:border-blue-primary focus:outline focus:outline-none"
                              name="drive"
                              placeholder="New drive..."
                            />
                            <Button
                              size={'small'}
                              variant={'outline'}
                              type="button"
                              onClick={(e) => handleCancelDrive(e, index)}
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
                        </Form>
                      </div>
                    ) : (
                      <div className="flex flex-row w-full justify-between items-center gap-2">
                        <Text
                          className="w-full"
                          variant="small"
                          color="foreground"
                        >
                          {drive.name}
                        </Text>
                        {/* TODO: will remove this button later. Just here for testing purposes
                                    remove button will be inside the ellipsis button
                          */}
                        <Button
                          size={'small'}
                          variant={'outline'}
                          type="button"
                          onClick={(e) => handleCancelDrive(e, index)}
                        >
                          <LucideX />
                        </Button>
                        <Button
                          onClick={(e) => e.stopPropagation()}
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
                  onClick={() => {
                    addDrive();
                  }}
                  disabled={
                    drivesOptionsMock.some((drive) => drive.name === '') ||
                    level === ''
                  }
                >
                  <LucidePlus /> Add drive
                </Button>
              ) : (
                <Button size={'small'} variant={'primary'} disabled>
                  <LucidePlus /> Add drive
                </Button>
              )}
            </div>
          </div>
          {/* @TODO Make a positionComponent */}
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
                  className={`bg-main-white px-6  ${selectedPosition === position.id ? 'border-2 border-blue-primary' : 'border-2 border-transparent'}`}
                  key={index}
                >
                  <div
                    className="py-3"
                    onClick={() => {
                      setSelectedPosition(position.id);
                    }}
                  >
                    {position.name === '' ? (
                      <div>
                        {/* @TODO Make a positionFormComponent */}
                        <Form {...positionForm}>
                          <form
                            onSubmit={(e) => handleSubmitPosition(e, index)}
                            className="flex flex-row w-full justify-between items-center gap-2"
                          >
                            <input
                              className="w-full focus:border-blue-primary focus:outline focus:outline-none"
                              name="position"
                              placeholder="New position..."
                            />

                            <Button
                              size={'small'}
                              variant={'outline'}
                              type="button"
                              onClick={(e) => handleCancelPosition(e, index)}
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
                        </Form>
                      </div>
                    ) : (
                      <div className="flex flex-row w-full justify-between items-center gap-2">
                        <Text
                          className="w-full"
                          variant="small"
                          color="foreground"
                        >
                          {position.name}
                        </Text>
                        {/* TODO: will remove this button later. Just here for testing purposes
                                    remove button will be inside the ellipsis button
                          */}
                        <Button
                          size={'small'}
                          variant={'outline'}
                          type="button"
                          onClick={(e) => handleCancelPosition(e, index)}
                        >
                          <LucideX />
                        </Button>
                        <Button
                          onClick={(e) => e.stopPropagation()}
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
                  onClick={() => addPosition()}
                  disabled={
                    positionsOptionsMock.some(
                      (position) => position.name === '',
                    ) || drive === ''
                  }
                >
                  <LucidePlus /> Add position
                </Button>
              ) : (
                <Button size={'small'} variant={'primary'} disabled>
                  <LucidePlus /> Add position
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
