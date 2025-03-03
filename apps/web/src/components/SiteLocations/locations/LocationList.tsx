import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { LucidePlus } from 'lucide-react';
import { LocationItem } from './LocationItem';
import { Button, Headline, Text } from '@gsp/ui';
import React, { useRef, useState } from 'react';
import {
  IDrive,
  ILocation,
} from '@/components/urql-siteslocations/SitesLocationsUrql';
import { getNextAvailableIndex } from '@/libs/utils';

type LocationsListComponentProps = {
  selectedDrive?: string;
  locationsOptions: ILocation[];
  drivesOptions: IDrive[];
  handleSetLocation: () => void;
};

const createLocationsMutation = graphql(`
  mutation createLocation($createLocationInput: CreateLocationInput!) {
    createLocation(createLocationInput: $createLocationInput) {
      locationName
      driveId
    }
  }
`);

export const LocationsList = ({
  selectedDrive,
  locationsOptions,
  drivesOptions,
  handleSetLocation,
}: LocationsListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [, createLocationMutation] = useMutation(createLocationsMutation);
  const [newLocationId, setNewLocationId] = useState<string | undefined>(
    undefined,
  );

  const drive = drivesOptions.find(
    (drive) => drive.driveName === selectedDrive,
  );

  const addLocation = async () => {
    if (!selectedDrive) return;

    try {
      const nextIndex = getNextAvailableIndex(
        locationsOptions.map((location) => ({ name: location.locationName })),
        'New location',
      );

      const defaultDriveName = `New location ${nextIndex}`;
      const response = await createLocationMutation({
        createLocationInput: {
          locationName: defaultDriveName,
          driveId: drive?.id || '',
        },
      });

      if (response.error) {
        console.error('Mutation error:', response.error);
        return;
      }

      console.log('Mutation response:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
        {locationsOptions?.map((location, index) => (
          <LocationItem
            key={location.id}
            index={index}
            location={location}
            inputRef={inputRef}
            locationsOptions={locationsOptions}
            isNewLocation={location.id === newLocationId}
            setNewLocationId={setNewLocationId}
            handleSetLocation={handleSetLocation}
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
