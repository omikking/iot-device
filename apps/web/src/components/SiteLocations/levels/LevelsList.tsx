import React, { useEffect, useRef } from 'react';
import { LevelItem } from './LevelItem';
import { Button, Headline, Text } from '@gsp/ui';
import {
  IDriveMock,
  ILevelMock,
  ILocationMock,
} from '@/app/(routes)/sitelocations/[id]/page';
import { LucidePlus } from 'lucide-react';

// @TODO have to fix why im getting warning
interface LevelsListComponentProps {
  levelsOptions: ILevelMock[];
  selectedLevel?: string;
  selectedSite?: string;
  handleSetLevel: () => void;
  // setLevelsOptionsMock: React.Dispatch<React.SetStateAction<ILevelMock[]>>;
  setDrivesOptionsMock: React.Dispatch<React.SetStateAction<IDriveMock[]>>;
  setLocationsOptionsMock: React.Dispatch<
    React.SetStateAction<ILocationMock[]>
  >;
}

export const LevelsList = ({
  levelsOptions,
  selectedLevel,
  selectedSite,
  handleSetLevel,
  // setLevelsOptionsMock,
  setDrivesOptionsMock,
  setLocationsOptionsMock,
}: LevelsListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addLevel = () => {
    levelsOptions.push({
      id: `${levelsOptions.length + 1}`,
      levelName: '',
      siteId: selectedSite as string,
      drives: [],
    });
    // setLevelsOptionsMock([...levelsOptionsMock] as ILevelMock[]);
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
            levelsOptionsMock={levelsOptions}
            index={index}
            inputRef={inputRef}
            handleSetLevel={handleSetLevel}
            // setLevelsOptionsMock={setLevelsOptionsMock}
            setDrivesOptionsMock={setDrivesOptionsMock}
            setLocationsOptionsMock={setLocationsOptionsMock}
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
