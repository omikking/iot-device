'use client';
import React, { useState, useEffect, useRef } from 'react';
import { LocationItem } from './LocationItem';
import { Button, Headline, Text } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import { Drive, Location } from '@/gql/graphql';

interface LocationsListProps {
  selectedDriveId?: string;
  locationsOptions: Location[];
  drivesOptions: Drive[];
  refreshSite: () => void;
}

export const LocationsList = ({
  selectedDriveId,
  locationsOptions,
  drivesOptions,
  refreshSite,
}: LocationsListProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    locationsOptions.length > 0
      ? setLocations(locationsOptions)
      : setLocations([]);
  }, [locationsOptions]);

  // Add a new empty location
  const addLocation = () => {
    const newLocation: Location = {
      id: '',
      locationName: '',
      driveId: selectedDriveId || '',
      createdAt: undefined,
      updatedAt: undefined,
    };
    setLocations((prevLocations) => [...prevLocations, newLocation]);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [locations]);

  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="small" color="foreground" isBold>
          Locations
        </Headline>
      </div>
      <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
        {locations.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <Text variant="small" color="foreground">
              Select site to view available locations
            </Text>
          </div>
        )}
        {locations.map((location) => (
          <LocationItem
            key={location.id}
            location={location}
            locationsOptions={locations}
            inputRef={inputRef}
            refreshSite={refreshSite}
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
              locations.some((location) => location.locationName === '')
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
