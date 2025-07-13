'use client';
import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import { DriveItem } from './DriveItem';
import { LucidePlus } from 'lucide-react';
import { Drive, Level } from '@/gql/graphql';
import { Button, Headline, Text } from '@gsp/ui';

type DrivesListProps = {
  drivesOptions: Drive[];
  selectedDriveId?: string;
  selectedLevelId?: string;
  levelsOptions: Level[];
  refreshSite: () => void;
  handleSetDrive: () => void;
  setSelectedDrive: Dispatch<SetStateAction<Drive | undefined>>;
};

export const DrivesList = ({
  drivesOptions,
  levelsOptions,
  selectedDriveId,
  selectedLevelId,
  refreshSite,
  handleSetDrive,
  setSelectedDrive,
}: DrivesListProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [drives, setDrives] = useState<Drive[]>(drivesOptions);
  const [isDeletingDrive, setIsDeletingDrive] = useState<boolean>(false);

  // Add a new empty drive
  const addDrive = () => {
    const newDrive: Drive = {
      id: '',
      driveName: '',
      locations: [],
      levelId: selectedLevelId || '',
      createdAt: undefined,
      updatedAt: undefined,
    };
    setDrives((prevDrives) => [...prevDrives, newDrive]);
  };

  useEffect(() => {
    if (!isDeletingDrive) {
      drivesOptions.length > 0 ? setDrives(drivesOptions) : setDrives([]);
    }
  }, [drivesOptions, isDeletingDrive]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [drives]);

  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="small" color="foreground" isBold>
          Drives
        </Headline>
      </div>
      <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
        {drives.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <Text variant="small" color="foreground">
              {selectedLevelId
                ? 'No drives found for the selected level'
                : 'Select level to view available drives'}
            </Text>
          </div>
        )}
        {drives.map((drive) => (
          <DriveItem
            key={drive.id}
            drive={drive}
            inputRef={inputRef}
            drivesOptions={drives}
            selectedDriveId={selectedDriveId}
            refreshSite={refreshSite}
            handleSetDrive={handleSetDrive}
            setSelectedDrive={setSelectedDrive}
            setIsDeletingDrive={setIsDeletingDrive}
          />
        ))}
      </div>
      <div className="flex justify-end w-full p-3">
        {selectedLevelId ? (
          <Button
            size={'small'}
            variant={'primary'}
            onClick={addDrive}
            disabled={
              levelsOptions.length === 0 ||
              drives.some((drive) => drive.driveName === '')
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
