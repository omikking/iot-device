import React from 'react';
import { Button } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';

interface LevelsOptionsMock {
  id: string;
  name: string;
}

interface AddLevelButtonProps {
  site: string | undefined;
  levelsOptionsMock: LevelsOptionsMock[];
  addLevel: () => void;
}

export const AddLevelButton: React.FC<AddLevelButtonProps> = ({
  site,
  levelsOptionsMock,
  addLevel,
}) => {
  return (
    <div className="flex justify-end w-full p-3">
      {site ? (
        <Button
          size={'small'}
          variant={'primary'}
          onClick={() => addLevel()}
          disabled={levelsOptionsMock.some((level) => level.name === '')}
        >
          <LucidePlus /> Add level
        </Button>
      ) : (
        <Button size={'small'} variant={'primary'} disabled>
          <LucidePlus /> Add level
        </Button>
      )}
    </div>
  );
};
