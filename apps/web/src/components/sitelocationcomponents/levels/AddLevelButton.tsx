import React from 'react';
import { Button } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import { ILevelMock } from '@/app/(routes)/siteslocations/page';

interface AddLevelButtonProps {
  site: string | undefined;
  levelsOptionsMock: ILevelMock[];
  addLevel: () => void;
}

export const AddLevelButton = ({
  site,
  levelsOptionsMock,
  addLevel,
}: AddLevelButtonProps) => {
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
