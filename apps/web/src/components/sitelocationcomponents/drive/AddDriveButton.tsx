import { IDriveMock } from '@/app/(routes)/siteslocations/page';
import { Button } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import React from 'react';

interface AddDriveButtonProps {
  site?: string;
  drivesOptionsMock: IDriveMock[];
  addDrive: () => void;
}

export const AddDriveButton = ({
  site,
  drivesOptionsMock,
  addDrive,
}: AddDriveButtonProps) => {
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
