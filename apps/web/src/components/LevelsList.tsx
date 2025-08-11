'use client';
import React, {
  useState,
  useEffect,
  useRef,
  SetStateAction,
  Dispatch,
} from 'react';
import { LevelItem } from './LevelItem';
import { Button, Headline, Text } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import { Drive, Level, Role } from '@/gql/graphql';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

type LevelsListProps = {
  levelsOptions: Level[];
  selectedLevelId?: string;
  selectedSiteId?: string;
  handleSetLevel: () => void;
  refreshSite: () => void;
  setSelectedLevel: Dispatch<SetStateAction<Level | undefined>>;
  setSelectedDrive: Dispatch<SetStateAction<Drive | undefined>>;
};

export const LevelsList = ({
  levelsOptions,
  selectedLevelId,
  selectedSiteId,
  handleSetLevel,
  refreshSite,
  setSelectedLevel,
  setSelectedDrive,
}: LevelsListProps) => {
  const params = useParams();
  const companyId = params.id as string;

  const { data: session } = useSession();
  const isUserSandvikAdmin = session?.user?.globalRole === Role.SandvikAdmin;
  const isUserCompanyAdmin = session?.user?.userPermissions?.some(
    (permission) =>
      permission.role === Role.CompanyAdmin &&
      permission.companyId === companyId,
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [levels, setLevels] = useState<Level[]>(levelsOptions);
  const [isDeletingLevel, setIsDeletingLevel] = useState<boolean>(false);

  // Add a new empty level
  const addLevel = () => {
    const newLevel: Level = {
      id: '',
      levelName: '',
      drives: [],
      siteId: selectedSiteId || '',
      createdAt: undefined,
      updatedAt: undefined,
    };
    setLevels((prevLevels) => [...prevLevels, newLevel]);
  };

  useEffect(() => {
    if (!isDeletingLevel) {
      levelsOptions.length > 0 ? setLevels(levelsOptions) : setLevels([]);
    }
  }, [levelsOptions, isDeletingLevel]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [levels]);

  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="small" color="foreground" isBold>
          Levels
        </Headline>
      </div>
      <div
        className={`flex flex-col gap-1 w-full h-full ${
          isUserSandvikAdmin || isUserCompanyAdmin ? 'border-y' : 'border-t'
        } py-6 px-6 overflow-auto`}
      >
        {levels.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <Text variant="small" color="foreground">
              {selectedSiteId
                ? 'No levels found for this site'
                : 'Select site to view available locations'}
            </Text>
          </div>
        )}
        {levels.map((level) => (
          <LevelItem
            inputRef={inputRef}
            key={level.id}
            level={level}
            selectedLevelId={selectedLevelId}
            levelsOptions={levels}
            handleSetLevel={handleSetLevel}
            refreshSite={refreshSite}
            setSelectedDrive={setSelectedDrive}
            setSelectedLevel={setSelectedLevel}
            setIsDeletingLevel={setIsDeletingLevel}
          />
        ))}
      </div>
      {(isUserSandvikAdmin || isUserCompanyAdmin) && (
        <div className="flex justify-end w-full p-3">
          {selectedSiteId ? (
            <Button
              size={'small'}
              variant={'primary'}
              onClick={addLevel}
              disabled={levels.some((level) => level.levelName === '')}
            >
              <LucidePlus /> Add level
            </Button>
          ) : (
            <Button size={'small'} variant={'primary'} disabled>
              <LucidePlus /> Add level
            </Button>
          )}
        </div>
      )}
    </>
  );
};
