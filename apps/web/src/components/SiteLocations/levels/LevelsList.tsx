import { LevelItem } from './LevelItem';
import { LucidePlus } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { Button, Headline, Text } from '@gsp/ui';
import {} from '@/app/(routes)/sitelocations/[id]/page';
import { ILevel } from '@/components/urql-siteslocations/SitesLocationsUrql';
// @TODO have to fix why im getting warning
interface LevelsListComponentProps {
  levelsOptions: ILevel[];
  selectedLevel?: string;
  selectedSite?: string;
  handleSetLevel: () => void;
}

export const LevelsList = ({
  levelsOptions,
  selectedLevel,
  selectedSite,
  handleSetLevel,
}: LevelsListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addLevel = () => {
    levelsOptions.push({
      id: `${levelsOptions.length + 1}`,
      levelName: '',
      siteId: selectedSite as string,
      drives: [],
    });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [levelsOptions]);
  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="small" color="foreground" isBold>
          Levels
        </Headline>
      </div>
      <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
        {levelsOptions?.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <Text variant="small" color="foreground">
              Select site to view available levels
            </Text>
          </div>
        )}
        {levelsOptions?.map((level, index) => (
          <LevelItem
            key={index}
            selectedLevel={selectedLevel}
            level={level}
            levelsOptions={levelsOptions}
            index={index}
            inputRef={inputRef}
            handleSetLevel={handleSetLevel}
          />
        ))}
      </div>
      <div className="flex justify-end w-full p-3">
        {selectedSite ? (
          <Button
            size={'small'}
            variant={'primary'}
            onClick={() => addLevel()}
            disabled={levelsOptions.some((level) => level.levelName === '')}
          >
            <LucidePlus /> Add level
          </Button>
        ) : (
          <Button size={'small'} variant={'primary'} disabled>
            <LucidePlus /> Add level
          </Button>
        )}
      </div>
    </>
  );
};
