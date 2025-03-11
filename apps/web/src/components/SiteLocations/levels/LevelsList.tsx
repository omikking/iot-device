import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { LevelItem } from './LevelItem';
import { LucidePlus } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Button, Headline, Text } from '@gsp/ui';
import { ILevel } from '@/components/urql-siteslocations/SitesLocationsUrql';
import { getNextAvailableIndex } from '@/libs/utils';
// @TODO have to fix why im getting warning
type LevelsListComponentProps = {
  levelsOptions: ILevel[];
  selectedLevel?: string;
  selectedSiteId?: string;
  handleSetLevel: () => void;
};

const createLevelsMutation = graphql(`
  mutation createLevel($createLevelInput: CreateLevelInput!) {
    createLevel(createLevelInput: $createLevelInput) {
      id
      levelName
      siteId
    }
  }
`);

export const LevelsList = ({
  levelsOptions,
  selectedLevel,
  selectedSiteId,
  handleSetLevel,
}: LevelsListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [, createLevelMutation] = useMutation(createLevelsMutation);
  const [newLevelId, setNewLevelId] = useState<string | undefined>(undefined);

  const addLevel = async () => {
    if (!selectedSiteId) return;

    // @TODO add try catch to every mutation
    try {
      const nextIndex = getNextAvailableIndex(
        levelsOptions.map((level) => ({ name: level.levelName })),
        'New level',
      );

      const defaultLevelName = `New level ${nextIndex}`;

      const response = await createLevelMutation({
        createLevelInput: {
          levelName: defaultLevelName, // create new level with default name, will be updated by user
          siteId: selectedSiteId,
        },
      });

      if (response.error) {
        console.error('Mutation error:', response.error);
        return;
      }

      console.log('Mutation response:', response);

      setNewLevelId(response.data?.createLevel?.id);
    } catch (error) {
      // @TODO add toast or alert for error?
      console.error('Mutation error:', error);
    }
  };

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
        {levelsOptions?.map((level, index) => {
          return (
            <LevelItem
              key={level.id} // backend generates an id
              level={level}
              index={index}
              inputRef={inputRef}
              selectedLevel={selectedLevel}
              levelsOptions={levelsOptions}
              isNewLevel={level.id === newLevelId}
              handleSetLevel={handleSetLevel}
              setNewLevelId={setNewLevelId}
            />
          );
        })}
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
