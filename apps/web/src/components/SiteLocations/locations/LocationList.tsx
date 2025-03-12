'use client';
import React, { useEffect, useRef } from 'react';
import { LocationItem } from './LocationItem';
import { Button, Headline, Text } from '@gsp/ui';
import { IDriveMock, ILocationMock } from '@/app/(routes)/sitelocations/page';
import { LucidePlus } from 'lucide-react';

interface LocationsListComponentProps {
  selectedDrive?: string;
  locationsOptionsMock: ILocationMock[];
  drivesOptionsMock: IDriveMock[];
  handleSetLocation: () => void;
  setLocationsOptionsMock: React.Dispatch<
    React.SetStateAction<ILocationMock[]>
  >;
}

export const LocationsList = ({
  selectedDrive,
  locationsOptionsMock,
  drivesOptionsMock,
  handleSetLocation,
  setLocationsOptionsMock,
}: LocationsListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addLocation = () => {
    locationsOptionsMock.push({
      id: `${locationsOptionsMock.length + 1}`,
      name: '',
    });
    setLocationsOptionsMock([...locationsOptionsMock] as ILocationMock[]);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [locationsOptionsMock]);

  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="small" color="foreground" isBold>
          Locations
        </Headline>
      </div>
      <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
        {locationsOptionsMock?.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <Text variant="small" color="foreground">
              Select site to view available locations
            </Text>
          </div>
        )}
        {locationsOptionsMock?.map((location, index) => (
          <LocationItem
            key={index}
            location={location}
            locationsOptionsMock={locationsOptionsMock}
            index={index}
            inputRef={inputRef}
            handleSetLocation={handleSetLocation}
            setLocationsOptionsMock={setLocationsOptionsMock}
          />
        ))}
      </div>
      <div className="flex justify-end w-full p-3">
        {selectedDrive ? (
          <Button
            size={'small'}
            variant={'primary'}
            onClick={() => addLocation()}
            disabled={
              drivesOptionsMock.length === 0 ||
              locationsOptionsMock.some((location) => location.name === '')
            }
          >
            <LucidePlus /> Add location
          </Button>
        ) : (
          <Button size={'small'} variant={'primary'} disabled>
            <LucidePlus /> Add location
          </Button>
        )}
      </div>
    </>
  );
};
