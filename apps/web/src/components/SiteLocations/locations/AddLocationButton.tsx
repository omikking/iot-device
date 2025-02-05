import { ILocationMock } from '@/app/(routes)/sitelocations/[id]/page';
import { Button } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import React from 'react';

interface AddLocationButtonProps {
  site?: string;
  locationsOptionsMock: ILocationMock[];
  addLocation: () => void;
}

export const AddLocationButton = ({
  site,
  locationsOptionsMock,
  addLocation,
}: AddLocationButtonProps) => {
  return (
    <div className="flex justify-end w-full p-3">
      {site ? (
        <Button
          size={'small'}
          variant={'primary'}
          onClick={() => addLocation()}
          disabled={locationsOptionsMock.some(
            (location) => location.name === '',
          )}
        >
          <LucidePlus /> Add location
        </Button>
      ) : (
        <Button size={'small'} variant={'primary'} disabled>
          <LucidePlus /> Add location
        </Button>
      )}
    </div>
  );
};
