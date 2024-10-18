import React from 'react';
import { LevelComponent } from './LevelComponent';
import { AddLevelButton } from './AddLevelButton';
import { Headline, Text } from '@gsp/ui';

interface LevelsOptionsMock {
  id: string;
  name: string;
}
interface LevelFormData {
  id: string;
  name: string;
}
// @TODO have to fix why im getting warning
interface LevelsListComponentProps {
  levelsOptionsMock: LevelsOptionsMock[];
  selectedLevel: string;
  handleSetLevel: (name: string) => void;
  setSelectedLevel: (id: string) => void;
  levelForm: LevelFormData;
  handleSubmitLevel: (
    event: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => void;
  handleCancelLevel: (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => void;
  site: string | undefined;
  addLevel: any;
}

export const LevelsListComponent: React.FC<LevelsListComponentProps> = ({
  levelsOptionsMock,
  selectedLevel,
  handleSetLevel,
  setSelectedLevel,
  levelForm,
  handleSubmitLevel,
  handleCancelLevel,
  site,
  addLevel,
}) => {
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
          <LevelComponent
            key={index}
            level={level}
            index={index}
            selectedLevel={selectedLevel}
            handleSetLevel={handleSetLevel}
            setSelectedLevel={setSelectedLevel}
            levelForm={levelForm}
            handleSubmitLevel={handleSubmitLevel}
            handleCancelLevel={handleCancelLevel}
          />
        ))}
      </div>
      <AddLevelButton
        site={site}
        levelsOptionsMock={levelsOptionsMock}
        addLevel={addLevel}
      />
    </>
  );
};
