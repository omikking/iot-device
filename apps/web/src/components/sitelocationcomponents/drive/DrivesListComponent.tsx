import React, { useEffect, useRef } from 'react';
import { DriveComponent } from './DriveComponent';
import { Button, Headline, Text } from '@gsp/ui';
import {
  IDriveMock,
  ILevelMock,
  IPositionMock,
} from '@/app/(routes)/siteslocations/page';
import { LucidePlus } from 'lucide-react';

interface DrivesListComponentProps {
  drivesOptionsMock: IDriveMock[];
  selectedDrive: string;
  selectedLevel?: string;
  levelsOptionsMock: ILevelMock[];
  setDrivesOptionsMock: React.Dispatch<React.SetStateAction<IDriveMock[]>>;
  setPositionsOptionsMock: React.Dispatch<
    React.SetStateAction<IPositionMock[]>
  >;
  handleSetDrive: () => void;
}

export const DrivesListComponent = ({
  drivesOptionsMock,
  selectedDrive,
  selectedLevel,
  levelsOptionsMock,
  setDrivesOptionsMock,
  setPositionsOptionsMock,
  handleSetDrive,
}: DrivesListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Creates a new empty drive to fill in
  const addDrive = () => {
    drivesOptionsMock.push({
      id: `${drivesOptionsMock.length + 1}`,
      name: '',
      positions: [],
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
        <Headline as="h2" variant="smallBold" color="foreground">
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
          <DriveComponent
            drive={drive}
            drivesOptionsMock={drivesOptionsMock}
            selectedDrive={selectedDrive}
            inputRef={inputRef}
            index={index}
            setDrivesOptionsMock={setDrivesOptionsMock}
            setPositionsOptionsMock={setPositionsOptionsMock}
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
