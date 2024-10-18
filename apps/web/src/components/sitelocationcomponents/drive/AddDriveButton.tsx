import { Button } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import React from 'react';

interface DriveOptionsMock {
  id: string;
  name: string;
}

interface AddDriveButtonProps {
  site: string | undefined;
  drivesOptionsMock: DriveOptionsMock[];
  addDrive: () => void;
}

export const AddDriveButton: React.FC<AddDriveButtonProps> = ({
  site,
  drivesOptionsMock,
  addDrive,
}) => {
  return (
    <div className="flex justify-end w-full p-3">
      {site ? (
        <Button
          size={'small'}
          variant={'primary'}
          onClick={() => addDrive()}
          disabled={drivesOptionsMock.some((drive) => drive.name === '')}
        >
          <LucidePlus /> Add drive
        </Button>
      ) : (
        <Button size={'small'} variant={'primary'} disabled>
          <LucidePlus /> Add drive
        </Button>
      )}
    </div>
  );
};
