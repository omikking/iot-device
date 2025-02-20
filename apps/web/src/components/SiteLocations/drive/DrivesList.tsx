import React, { useEffect, useRef } from 'react';
import { DriveItem } from './DriveItem';
import { Button, Headline, Text } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import {
  ILevel,
  IDrive,
} from '@/components/urql-siteslocations/SitesLocationsUrql';
interface DrivesListComponentProps {
  drivesOptions: IDrive[];
  selectedDrive?: string;
  selectedLevel?: string;
  levelsOptions: ILevel[];
  handleSetDrive: () => void;
}
export const DrivesList = ({
  drivesOptions,
  selectedDrive,
  selectedLevel,
  levelsOptions,
  handleSetDrive,
}: DrivesListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addDrive = () => {
    drivesOptions.push({
      id: `${drivesOptions.length + 1}`,
      driveName: '',
      levelId: selectedLevel as string,
      locations: [],
    });
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
            selectedDrive={selectedDrive}
            inputRef={inputRef}
            index={index}
            handleSetDrive={handleSetDrive}
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
