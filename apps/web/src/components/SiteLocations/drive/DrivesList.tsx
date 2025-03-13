'use client';
import React, { useEffect, useRef } from 'react';
import { DriveItem } from './DriveItem';
import { Button, Headline, Text } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import { Drive, Level, Location } from '@/gql/graphql';

interface DrivesListComponentProps {
  drivesOptions: Drive[];
  selectedDriveId?: string;
  selectedLevelId?: string;
  levelsOptions: Level[];
  setDrivesOptions: React.Dispatch<React.SetStateAction<Drive[]>>;
  setLocationsOptions: React.Dispatch<React.SetStateAction<Location[]>>;
  handleSetDrive: () => void;
}
export const DrivesList = ({
  drivesOptions,
  selectedDriveId,
  selectedLevelId,
  levelsOptions,
  setDrivesOptions,
  setLocationsOptions,
  handleSetDrive,
}: DrivesListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addDrive = () => {
    drivesOptions.push({
      id: `${drivesOptions.length + 1}`,
      driveName: '',
      locations: [],
      createdAt: undefined,
      levelId: '',
      updatedAt: undefined,
    });
    setDrivesOptions([...drivesOptions] as Drive[]);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [drivesOptions]);

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
            key={index}
            drive={drive}
            drivesOptions={drivesOptions}
            selectedDriveId={selectedDriveId}
            inputRef={inputRef}
            index={index}
            setDrivesOptions={setDrivesOptions}
            setLocationsOptions={setLocationsOptions}
            handleSetDrive={handleSetDrive}
          />
        ))}
      </div>
      <div className="flex justify-end w-full p-3">
        {selectedLevelId ? (
          <Button
            size={'small'}
            variant={'primary'}
            onClick={() => addDrive()}
            disabled={
              levelsOptions.length === 0 ||
              drivesOptions.some((drive) => drive.driveName === '')
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
