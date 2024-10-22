import React, { useEffect, useRef } from 'react';
import { DriveComponent } from './DriveComponent';
import { Headline, Text } from '@gsp/ui';
import { UseFormReturn } from 'react-hook-form';
import { SitesLocationFormData } from '@/app/(routes)/siteslocations/page';

interface DrivesListComponentProps {
  drivesOptionsMock: SitesLocationFormData[];
  selectedDrive: string;
  handleSetDrive: (name: string) => void;
  setSelectedDrive: (id: string) => void;
  driveForm: UseFormReturn<SitesLocationFormData>;
  handleSubmitDrive: (
    event: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => void;
  handleCancelDrive: (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => void;
}

export const DrivesListComponent: React.FC<DrivesListComponentProps> = ({
  drivesOptionsMock,
  selectedDrive,
  handleSetDrive,
  setSelectedDrive,
  driveForm,
  handleSubmitDrive,
  handleCancelDrive,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

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
            key={index}
            drive={drive}
            index={index}
            selectedDrive={selectedDrive}
            handleSetDrive={handleSetDrive}
            setSelectedDrive={setSelectedDrive}
            driveForm={driveForm}
            handleSubmitDrive={handleSubmitDrive}
            handleCancelDrive={handleCancelDrive}
            inputRef={inputRef}
          />
        ))}
      </div>
    </>
  );
};
