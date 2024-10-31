import React from 'react';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { Button, Text } from '@gsp/ui';
import { LucideX, LucideEllipsis } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IDriveMock,
  ILevelMock,
  IPositionMock,
} from '@/app/(routes)/siteslocations/page';

interface LevelComponentProps {
  selectedLevel: string;
  level: ILevelMock;
  levelsOptionsMock: ILevelMock[];
  index: number;
  inputRef: React.RefObject<HTMLInputElement>;
  // @TODO Gives error but it works. investigate why.
  // eslint-disable-next-line no-unused-vars
  handleSetLevel: (name: string) => void;
  setLevelsOptionsMock: React.Dispatch<React.SetStateAction<ILevelMock[]>>;
  setDrivesOptionsMock: React.Dispatch<React.SetStateAction<IDriveMock[]>>;
  setPositionsOptionsMock: React.Dispatch<
    React.SetStateAction<IPositionMock[]>
  >;
}

export const LevelItem = ({
  selectedLevel,
  level,
  levelsOptionsMock,
  index,
  inputRef,
  handleSetLevel,
  setLevelsOptionsMock,
  setDrivesOptionsMock,
  setPositionsOptionsMock,
}: LevelComponentProps) => {
  const levelFormSchema = z.object({
    id: z.string(),
    name: z.string(),
  });

  const levelForm = useForm<z.infer<typeof levelFormSchema>>({
    resolver: zodResolver(levelFormSchema),
    defaultValues: {
      id: '',
      name: '',
    },
  });

  const handleCancelLevel = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.preventDefault();

    const newLevels = [...levelsOptionsMock];
    newLevels[index].drives = [];
    newLevels.splice(index, 1);
    setLevelsOptionsMock(newLevels);

    setDrivesOptionsMock([]);
    setPositionsOptionsMock([]);
  };

  const handleSubmitLevel = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newLevelName = formData.get('level') as string;
    const isDuplicate = levelsOptionsMock.some(
      (level) => level.name.toLowerCase() === newLevelName.toLowerCase(),
    );

    if (isDuplicate) {
      alert('This level already exists. Please enter a different level.');
      return;
    }

    const newLevel = {
      ...levelsOptionsMock[index],
      name: formData.get('level') as string,
      drives: [],
    };
    const newLevelsList = [...levelsOptionsMock];
    newLevelsList[index] = newLevel;
    setLevelsOptionsMock(newLevelsList);
  };
  return (
    <div
      className={`bg-main-white px-6 ${selectedLevel === level.name ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div className="py-3" onClick={() => handleSetLevel(level.name)}>
        {level.name === '' ? (
          <div>
            <SiteLocationsForm
              form={levelForm}
              onSubmit={handleSubmitLevel}
              onCancel={handleCancelLevel}
              placeholder="New level..."
              name="level"
              index={index}
              inputRef={inputRef}
            />
          </div>
        ) : (
          <div className="flex flex-row w-full justify-between items-center gap-2">
            <Text className="w-full" variant="small" color="foreground">
              {level.name}
            </Text>
            <Button
              size={'small'}
              variant={'outline'}
              type="button"
              onClick={(e) => handleCancelLevel(e, index)}
            >
              <LucideX />
            </Button>
            <Button
              onClick={(e) => e.stopPropagation()}
              size={'small'}
              variant={'outline'}
            >
              <LucideEllipsis />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
