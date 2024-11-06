import React from 'react';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { Button, Text } from '@gsp/ui';
import { LucideEllipsis, LucideX } from 'lucide-react';
import { IDriveMock, IPositionMock } from '@/app/(routes)/sitelocations/page';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface DriveComponentProps {
  drive: IDriveMock;
  drivesOptionsMock: IDriveMock[];
  index: number;
  selectedDrive?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  // @TODO Gives error but it works. investigate why.
  // eslint-disable-next-line no-unused-vars
  handleSetDrive: (name: string) => void;
  setPositionsOptionsMock: React.Dispatch<
    React.SetStateAction<IPositionMock[]>
  >;
  setDrivesOptionsMock: React.Dispatch<React.SetStateAction<IDriveMock[]>>;
}

export const DriveItem = ({
  drive,
  drivesOptionsMock,
  selectedDrive,
  inputRef,
  index,
  setDrivesOptionsMock,
  setPositionsOptionsMock,
  handleSetDrive,
}: DriveComponentProps) => {
  const driveFormSchema = z.object({
    id: z.string(),
    name: z.string(),
  });

  const driveForm = useForm<z.infer<typeof driveFormSchema>>({
    resolver: zodResolver(driveFormSchema),
    defaultValues: {
      id: '',
      name: '',
    },
  });

  const handleCancelDrive = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.preventDefault();

    const newDrives = [...drivesOptionsMock];
    newDrives[index].positions = [];
    newDrives.splice(index, 1);
    setDrivesOptionsMock(newDrives);

    setPositionsOptionsMock([]);
  };

  const handleSubmitDrive = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newDriveName = formData.get('drive') as string;

    const isDuplicate = drivesOptionsMock.some(
      (drive) => drive.name === newDriveName,
    );

    if (isDuplicate) {
      alert('This drive already exists. Please enter a different drive.');
      return;
    }

    const newDrive = {
      ...drivesOptionsMock[index],
      name: formData.get('drive') as string,
      positions: [],
    };
    const newDrives = [...drivesOptionsMock];
    newDrives[index] = newDrive;
    setDrivesOptionsMock(newDrives);
  };

  return (
    <div
      className={`bg-main-white px-6 ${selectedDrive === drive.name ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div className="py-3" onClick={() => handleSetDrive(drive.name)}>
        {!drive.name ? (
          <SiteLocationsForm
            form={driveForm}
            onSubmit={handleSubmitDrive}
            onCancel={handleCancelDrive}
            placeholder="New drive..."
            name="drive"
            index={index}
            inputRef={inputRef}
          />
        ) : (
          <div className="flex flex-row w-full justify-between items-center gap-2">
            <Text className="w-full" variant="small" color="foreground">
              {drive.name}
            </Text>
            <Button
              size={'small'}
              variant={'outline'}
              type="button"
              onClick={(e) => handleCancelDrive(e, index)}
            >
              <LucideX />
            </Button>
            <Button
              onClick={(e) => e.stopPropagation()}
              size={'small'}
              variant={'outline'}
            >
              <LucideEllipsis />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
