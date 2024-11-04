import React, { useEffect, useRef } from 'react';
import { LevelItem } from './LevelItem';
import { Button, Headline, Text } from '@gsp/ui';
import {
  IDriveMock,
  ILevelMock,
  IPositionMock,
} from '@/app/(routes)/sitelocations/page';
import { LucidePlus } from 'lucide-react';

// @TODO have to fix why im getting warning
interface LevelsListComponentProps {
  levelsOptionsMock: ILevelMock[];
  selectedLevel?: string;
  selectedSite?: string;
  handleSetLevel: () => void;
  setLevelsOptionsMock: React.Dispatch<React.SetStateAction<ILevelMock[]>>;
  setDrivesOptionsMock: React.Dispatch<React.SetStateAction<IDriveMock[]>>;
  setPositionsOptionsMock: React.Dispatch<
    React.SetStateAction<IPositionMock[]>
  >;
}

export const LevelsList = ({
  levelsOptionsMock,
  selectedLevel,
  selectedSite,
  handleSetLevel,
  setLevelsOptionsMock,
  setDrivesOptionsMock,
  setPositionsOptionsMock,
}: LevelsListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addLevel = () => {
    levelsOptionsMock.push({
      id: `${levelsOptionsMock.length + 1}`,
      name: '',
      drives: [],
    });
    setLevelsOptionsMock([...levelsOptionsMock] as ILevelMock[]);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [levelsOptionsMock]);
  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="smallBold" color="foreground">
          Levels
        </Headline>
      </div>
      <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
        {levelsOptionsMock?.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <Text variant="small" color="foreground">
              Select site to view available levels
            </Text>
          </div>
        )}
        {levelsOptionsMock?.map((level, index) => (
          <LevelItem
            selectedLevel={selectedLevel}
            level={level}
            levelsOptionsMock={levelsOptionsMock}
            index={index}
            inputRef={inputRef}
            handleSetLevel={handleSetLevel}
            setLevelsOptionsMock={setLevelsOptionsMock}
            setDrivesOptionsMock={setDrivesOptionsMock}
            setPositionsOptionsMock={setPositionsOptionsMock}
          />
        ))}
      </div>
      <div className="flex justify-end w-full p-3">
        {selectedSite ? (
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
    </>
  );
};
