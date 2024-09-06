'use client';
import { Anchor, Badge, Button, Dropdown, Headline, Text } from '@gsp/ui';
import { get } from 'http';
import { LucideMoveLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Page(): JSX.Element {
  const locationDropdownOptions = [
    {
      id: '1',
      name: 'Garpenberg',
    },
    {
      id: '2',
      name: 'Scalperberg',
    },
  ];
  const siteLocations = [
    {
      id: '1',
      name: 'Garpenberg',
      levels: [
        {
          id: '4100',
          name: '4100',
          drives: [
            {
              id: '2100',
              name: '2100',
              positions: [{ id: '3100', name: '3100' }],
            },
            {
              id: '2101',
              name: '2101',
              positions: [{ id: '3101', name: '3101' }],
            },
          ],
        },
        {
          id: '4101',
          name: '4101',
          drives: [
            {
              id: '2102',
              name: '2102',
              positions: [
                { id: '3102', name: '3102' },
                { id: '3103', name: '3103' },
              ],
            },
          ],
        },
        {
          id: '4102',
          name: '4102',
          drives: [
            {
              id: '2103',
              name: '2103',
              positions: [
                { id: '3104', name: '3104' },
                { id: '3105', name: '3105' },
                { id: '3106', name: '3106' },
                { id: '3107', name: '3107' },
                { id: '3108', name: '3108' },
              ],
            },
            {
              id: '2104',
              name: '2104',
              positions: [{ id: '3109', name: '3109' }],
            },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Scalperberg',
      levels: [
        {
          id: '4200',
          name: '4200',
          drives: [
            {
              id: '2200',
              name: '2200',
              positions: [{ id: '3200', name: '3200' }],
            },
            {
              id: '2201',
              name: '2201',
              positions: [{ id: '3201', name: '3201' }],
            },
          ],
        },
        {
          id: '4201',
          name: '4201',
          drives: [
            {
              id: '2202',
              name: '2202',
              positions: [{ id: '3202', name: '3202' }],
            },
            {
              id: '2203',
              name: '2203',
              positions: [{ id: '3202', name: '3202' }],
            },
          ],
        },
      ],
    },
  ];

  const [dropdownValue, setDropdownValue] = useState<string | undefined>(
    undefined,
  );

  const getRoleById = (id: string) => {
    return locationDropdownOptions.find((location) => location.id === id)?.name;
  };

  const foo = (site: string) => {
    if (site) return siteLocations.find((location) => location.name === site);
  };

  const selectLevel = (level: string) => {};

  // const selectedLevels =

  if (dropdownValue) {
    // console.log(getRoleById(dropdownValue));
    console.log('WDadwa', foo(getRoleById(dropdownValue)));
  }

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
          selectedId={dropdownValue}
          onSelect={(e) => setDropdownValue(e)}
          options={locationDropdownOptions}
          className="w-[400px]"
        />

        <div className="flex w-fll max-w-[1320px] h-[740px] justify-around items-center bg-neutral-1 border-2">
          <div className="flex flex-col min-w-56 w-full h-full justify-between items-center">
            <div className="flex flex-row w-full p-6">
              <Headline as="h2" variant="smallBold" color="foreground">
                Levels
              </Headline>
            </div>
            <div className="flex flex-col gap-1 w-full h-full border-y py-6 overflow-auto">
              <Button
                variant={'outline'}
                size={'small'}
                onClick={() => console.log('first')}
                asChild
                className="ui-w-full ui-bg-main-white ui-mx-6 ui-px-6 ui-py-5"
              >
                <p>dawd</p>
                {/* <div className="bg-main-white mx-6 px-6 py-5">dawdaw</div> */}
              </Button>
              {foo(getRoleById(dropdownValue))?.levels.map((level) => (
                <div
                  onClick={() => console.log('first')}
                  className="bg-main-white mx-6 px-6 py-5"
                >
                  <Text variant="medium" color="foreground">
                    {level.name}
                  </Text>
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
            <div className="flex flex-col gap-1 w-full h-full border-y py-6 overflow-auto">
              {foo(getRoleById(dropdownValue))?.levels[1]?.drives.map(
                (drive) => (
                  <div className="bg-main-white mx-6 px-6 py-5" key={drive.id}>
                    {drive.name}
                  </div>
                ),
              )}
            </div>
            <div className="flex justify-end w-full">Add level</div>
          </div>
          <div className="flex flex-col min-w-72 w-full h-full justify-between items-center">
            <div className="flex flex-row w-full p-6">
              <Headline as="h2" variant="smallBold" color="foreground">
                Positions
              </Headline>
            </div>
            <div className="flex flex-col gap-1 w-full h-full border-y py-6 overflow-auto">
              <div className="bg-main-white mx-6 px-6 py-5">4000</div>
              <div className="bg-main-white mx-6 px-6 py-5">4000</div>
              <div className="bg-main-white mx-6 px-6 py-5">4000</div>
              <div className="bg-main-white mx-6 px-6 py-5">4000</div>
              <div className="bg-main-white mx-6 px-6 py-5">4000</div>
            </div>
            <div className="flex justify-end w-full">Add level</div>
          </div>
        </div>
      </div>
    </main>
  );
}
