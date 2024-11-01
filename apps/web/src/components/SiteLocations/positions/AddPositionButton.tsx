import { IPositionMock } from '@/app/(routes)/sitelocations/page';
import { Button } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import React from 'react';

interface AddPositionButtonProps {
  site?: string;
  positionsOptionsMock: IPositionMock[];
  addPosition: () => void;
}

export const AddPositionButton = ({
  site,
  positionsOptionsMock,
  addPosition,
}: AddPositionButtonProps) => {
  return (
    <div className="flex justify-end w-full p-3">
      {site ? (
        <Button
          size={'small'}
          variant={'primary'}
          onClick={() => addPosition()}
          disabled={positionsOptionsMock.some(
            (position) => position.name === '',
          )}
        >
          <LucidePlus /> Add position
        </Button>
      ) : (
        <Button size={'small'} variant={'primary'} disabled>
          <LucidePlus /> Add position
        </Button>
      )}
    </div>
  );
};
