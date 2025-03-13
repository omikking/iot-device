'use client';
import React, { useEffect, useRef } from 'react';
import { LevelItem } from './LevelItem';
import { Button, Headline, Text } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import { Drive, Level, Location } from '@/gql/graphql';

interface LevelsListComponentProps {
  levelsOptions: Level[];
  selectedLevelId?: string;
  selectedSiteId?: string;
  handleSetLevel: () => void;
  setLevelsOptions: React.Dispatch<React.SetStateAction<Level[]>>;
  setDrivesOptions: React.Dispatch<React.SetStateAction<Drive[]>>;
  setLocationsOptions: React.Dispatch<React.SetStateAction<Location[]>>;
}

export const LevelsList = ({
  levelsOptions,
  selectedLevelId,
  selectedSiteId,
  handleSetLevel,
  setLevelsOptions,
  setDrivesOptions,
  setLocationsOptions,
}: LevelsListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addLevel = () => {
    levelsOptions.push({
      id: `${levelsOptions.length + 1}`,
      levelName: '',
      drives: [],
      createdAt: undefined,
      siteId: '',
      updatedAt: undefined,
    });
    setLevelsOptions([...levelsOptions] as Level[]);
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
            selectedLevelId={selectedLevelId}
            level={level}
            levelsOptions={levelsOptions}
            index={index}
            inputRef={inputRef}
            handleSetLevel={handleSetLevel}
            setLevelsOptions={setLevelsOptions}
            setDrivesOptions={setDrivesOptions}
            setLocationsOptions={setLocationsOptions}
          />
        ))}
      </div>
      <div className="flex justify-end w-full p-3">
        {selectedSiteId ? (
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
