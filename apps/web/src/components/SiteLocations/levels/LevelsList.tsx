import { LevelItem } from './LevelItem';
import { LucidePlus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Headline, Text } from '@gsp/ui';
import {} from '@/app/(routes)/sitelocations/[id]/page';
import { ILevel } from '@/components/urql-siteslocations/SitesLocationsUrql';
import { useMutation } from 'urql';
import { graphql } from '@/gql';

// @TODO have to fix why im getting warning
interface LevelsListComponentProps {
  levelsOptions: ILevel[];
  selectedLevel?: string;
  selectedSiteId?: string;
  handleSetLevel: () => void;
}

const createLevelsMutation = graphql(`
  mutation createLevel($createLevelInput: CreateLevelInput!) {
    createLevel(createLevelInput: $createLevelInput) {
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
  const [result, createLevelMutation] = useMutation(createLevelsMutation);
  const [newLevelId, setNewLevelId] = useState<string | undefined>(undefined);

  const addLevel = async () => {
    if (!selectedSiteId) return;

    // @TODO add try catch to every mutation
    try {
      // is this the best way to handle this?
      // user can create level with default name, will be updated by user
      const fooTemp = `New level ${levelsOptions.length + 1}`;

      const response = await createLevelMutation({
        createLevelInput: {
          levelName: fooTemp, // create new level with default name, will be updated by user
          siteId: selectedSiteId,
        },
      });
      console.log('Result', result);

      if (response.error) {
        console.error('Mutation error:', response.error);
        return;
      }

      console.log('Mutation response:', response);

      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }

      // Focus the input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    } catch (error) {
      // @TODO add toast or alert for error?
      console.error('Mutation error:', error);
    }
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
            key={level.id} // backend generates an id
            selectedLevel={selectedLevel}
            level={level}
            levelsOptions={levelsOptions}
            index={index}
            inputRef={inputRef}
            handleSetLevel={handleSetLevel}
            isNewLevel={level.id === newLevelId}
            setNewLevelId={setNewLevelId}
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
