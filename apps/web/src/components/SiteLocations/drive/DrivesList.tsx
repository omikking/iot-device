import React, { useEffect, useRef } from 'react';
import { DriveItem } from './DriveItem';
import { Button, Headline, Text } from '@gsp/ui';
import {
  IDriveMock,
  ILevelMock,
  ILocationMock,
} from '@/app/(routes)/sitelocations/[id]/page';
import { LucidePlus } from 'lucide-react';

interface DrivesListComponentProps {
  drivesOptionsMock: IDriveMock[];
  selectedDrive?: string;
  selectedLevel?: string;
  levelsOptionsMock: ILevelMock[];
  setDrivesOptionsMock: React.Dispatch<React.SetStateAction<IDriveMock[]>>;
  setLocationsOptionsMock: React.Dispatch<
    React.SetStateAction<ILocationMock[]>
  >;
  handleSetDrive: () => void;
}
export const DrivesList = ({
  drivesOptionsMock,
  selectedDrive,
  selectedLevel,
  levelsOptionsMock,
  setDrivesOptionsMock,
  setLocationsOptionsMock,
  handleSetDrive,
}: DrivesListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addDrive = () => {
    drivesOptionsMock.push({
      id: `${drivesOptionsMock.length + 1}`,
      name: '',
      locations: [],
    });
    setDrivesOptionsMock([...drivesOptionsMock] as IDriveMock[]);
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [drivesOptionsMock]);
  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="small" color="foreground" isBold>
          Drives
        </Headline>
      </div>
      <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
        {drivesOptionsMock?.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <Text variant="small" color="foreground">
              Select site to view available drives
            </Text>
          </div>
        )}
        {drivesOptionsMock?.map((drive, index) => (
          <DriveItem
            key={index}
            drive={drive}
            drivesOptionsMock={drivesOptionsMock}
            selectedDrive={selectedDrive}
            inputRef={inputRef}
            index={index}
            setDrivesOptionsMock={setDrivesOptionsMock}
            setLocationsOptionsMock={setLocationsOptionsMock}
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
              levelsOptionsMock.length === 0 ||
              drivesOptionsMock.some((drive) => drive.name === '')
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
