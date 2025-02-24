import {
  ILevel,
  IDrive,
} from '@/components/urql-siteslocations/SitesLocationsUrql';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { DriveItem } from './DriveItem';
import { LucidePlus } from 'lucide-react';
import { Button, Headline, Text } from '@gsp/ui';
import React, { useRef, useState } from 'react';

type DrivesListComponentProps = {
  drivesOptions: IDrive[];
  selectedDrive?: string;
  selectedLevel?: string;
  levelsOptions: ILevel[];
  handleSetDrive: () => void;
};

const createDrivesMutation = graphql(`
  mutation createDrive($createDriveInput: CreateDriveInput!) {
    createDrive(createDriveInput: $createDriveInput) {
      driveName
      levelId
    }
  }
`);

export const DrivesList = ({
  drivesOptions,
  selectedDrive,
  selectedLevel,
  levelsOptions,
  handleSetDrive,
}: DrivesListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [, createDriveMutation] = useMutation(createDrivesMutation);
  const [newDriveId, setNewDriveId] = useState<string | undefined>(undefined);

  // Finding the level to use levelId
  const level = levelsOptions.find(
    (level) => level.levelName === selectedLevel,
  );

  const addDrive = async () => {
    if (!selectedLevel) return;

    try {
      const fooTemp = `New drive ${drivesOptions.length + 1}`;
      const response = await createDriveMutation({
        createDriveInput: {
          driveName: fooTemp,
          levelId: level?.id || '',
        },
      });

      if (response.error) {
        console.error('Mutation error:', response.error);
        return;
      }
    } catch (error) {
      console.error('Mutation error:', error);
    }
  };

  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="small" color="foreground" isBold>
          Drives
        </Headline>
      </div>
      <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
        {drivesOptions?.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <Text variant="small" color="foreground">
              Select site to view available drives
            </Text>
          </div>
        )}
        {drivesOptions?.map((drive, index) => (
          <DriveItem
            key={drive.id}
            drive={drive}
            index={index}
            inputRef={inputRef}
            selectedDrive={selectedDrive}
            drivesOptions={drivesOptions}
            isNewDrive={drive.id === newDriveId}
            handleSetDrive={handleSetDrive}
            setNewDriveId={setNewDriveId}
          />
        ))}
      </div>
      <div className="flex justify-end w-full p-3">
        {selectedLevel ? (
          <Button
            size={'small'}
            variant={'primary'}
            onClick={() => addDrive()}
            disabled={
              levelsOptions.length === 0 ||
              drivesOptions.some((drive) => drive?.driveName === '')
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
    </>
  );
};
