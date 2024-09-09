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
import { BoltResultSchema, boltResultsMock, sitesMock } from './mock.ts';
import { LucideEllipsis, LucideMoveLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Page(): JSX.Element {
  const [site, setSite] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [drive, setDrive] = useState<string | undefined>(undefined);
  const [position, setPosition] = useState<string | undefined>(undefined);

  const [dropdownValue, setDropdownValue] = useState<string | undefined>(
    undefined,
  );

  const [boltResults, setBoltResults] = useState<
    BoltResultSchema[] | undefined
  >([]);

  const handleSite = () => {};

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
  };

  const handleSetDrive = (drive?: string) => {
    setDrive(drive);
    setPosition(undefined);
  };

  const levelsOptionsMock = sitesMock.find(
    (boltSites) => boltSites.name === site,
  )?.levels;

  // Finds available levels on the selected site
  const drivesOptionsMock = levelsOptionsMock?.find(
    (boltLevels) => boltLevels.name === level,
  )?.drives;

  const positionsOptionsMock = drivesOptionsMock?.find(
    (boltDrives) => boltDrives.name === drive,
  )?.positions;

  useEffect(() => {
    // Each time site gets updated, make a request to the BE to fetch and set them as below
    site ? setBoltResults(boltResultsMock) : setBoltResults(undefined);
    console.log(levelsOptionsMock);
  }, [site]);

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
          <div className="flex flex-col min-w-56 w-full h-full justify-between items-center">
            <div className="flex flex-row w-full p-6">
              <Headline as="h2" variant="smallBold" color="foreground">
                Levels
              </Headline>
            </div>
            <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
              {levelsOptionsMock?.map((level) => (
                // fix hover and click effect and active
                <div className="bg-main-white px-6">
                  <div
                    className="flex flex-row justify-between items-center py-5"
                    onClick={() => (
                      console.log('first'), handleSetLevel(level.name)
                    )}
                  >
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
                </div>
              ))}
            </div>
            <div className="flex justify-end w-full">Add level</div>
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center border-x">
            <div className="flex flex-row w-full p-6 ">
              <Headline as="h2" variant="smallBold" color="foreground">
                Drives
              </Headline>
            </div>
            <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
              {drivesOptionsMock?.map((drive) => (
                <div className="bg-main-white px-6">
                  <div
                    className="flex flex-row justify-between items-center py-5"
                    onClick={() => (
                      console.log('first'), handleSetDrive(drive.name)
                    )} // fix hover and click effect
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
            <div className="flex justify-end w-full">Add level</div>
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
            <div className="flex flex-row w-full p-6">
              <Headline as="h2" variant="smallBold" color="foreground">
                Positions
              </Headline>
            </div>
            <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
              {/* <div className="bg-main-white px-6"> */}
              {positionsOptionsMock?.map((position) => (
                <div className="bg-main-white px-6">
                  <div className="flex flex-row justify-between items-center py-5">
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
            {/* </div> */}
            <div className="flex justify-end w-full">Add level</div>
          </div>
        </div>
      </div>
    </main>
  );
}
