'use client';
import React, { useEffect, useRef } from 'react';
import { LocationItem } from './LocationItem';
import { Button, Headline, Text } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import { Drive, Location } from '@/gql/graphql';

interface LocationsListComponentProps {
  selectedDriveId?: string;
  locationsOptions: Location[];
  drivesOptions: Drive[];
  setLocationsOptions: React.Dispatch<React.SetStateAction<Location[]>>;
}

export const LocationsList = ({
  selectedDriveId,
  locationsOptions,
  drivesOptions,
  setLocationsOptions,
}: LocationsListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addLocation = () => {
    locationsOptions.push({
      id: '',
      locationName: '',
      createdAt: undefined,
      driveId: selectedDriveId || '',
      updatedAt: undefined,
    });
    setLocationsOptions([...locationsOptions] as Location[]);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [locationsOptions]);

  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="small" color="foreground" isBold>
          Locations
        </Headline>
      </div>
      <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
        {locationsOptions?.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <Text variant="small" color="foreground">
              Select site to view available locations
            </Text>
          </div>
        )}
        {locationsOptions?.map((location) => (
          <LocationItem
            key={location.id}
            location={location}
            locationsOptions={locationsOptions}
            inputRef={inputRef}
          />
        ))}
      </div>
      <div className="flex justify-end w-full p-3">
        {selectedDriveId ? (
          <Button
            size={'small'}
            variant={'primary'}
            onClick={addLocation}
            disabled={
              drivesOptions.length === 0 ||
              locationsOptions.some((location) => location.locationName === '')
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
