import { Button } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import React from 'react';

interface PositionsOptionsMock {
  id: string;
  name: string;
}

interface AddPositionButtonProps {
  site: string | undefined;
  positionsOptionsMock: PositionsOptionsMock[];
  addPosition: () => void;
}

export const AddPositionButton: React.FC<AddPositionButtonProps> = ({
  site,
  positionsOptionsMock,
  addPosition,
}) => {
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
