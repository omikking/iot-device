import React, { useEffect, useState } from 'react';
import { SiteLocationsForm } from '../SiteLocationsForm';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from '@gsp/ui';
import { LucideEllipsis, LucideSquarePen, LucideTrash2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IDriveMock,
  ILevelMock,
  IPositionMock,
} from '@/app/(routes)/sitelocations/page';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';

interface LevelComponentProps {
  selectedLevel?: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditLevel = () => {
    setIsEditing(true);
    levelForm.setValue('name', level.name);
  };

  const handleEditSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    const formData = new FormData(e.currentTarget);
    const newLevelName = formData.get('level') as string;

    const isDuplicate = levelsOptionsMock.some(
      (level) => level.name === newLevelName,
    );

    if (isDuplicate) {
      alert('This level already exists. Please enter a different level.');
      return;
    }

    const newLevels = [...levelsOptionsMock];
    newLevels[index] = {
      ...newLevels[index],
      name: newLevelName,
    };
    setLevelsOptionsMock(newLevels);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    levelForm.reset();
  };

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
    const newLevels = [...levelsOptionsMock];
    newLevels[index].drives = [];
    newLevels.splice(index, 1);

    setLevelsOptionsMock(newLevels);
    setDrivesOptionsMock([]);
    setPositionsOptionsMock([]);
  };

  return (
    <div
      className={`bg-main-white px-6 ${selectedLevel === level.name ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div
        className="py-3"
        onClick={() => !isEditing && handleSetLevel(level.name)}
      >
        {!level.name || isEditing ? (
          <SiteLocationsForm
            form={levelForm}
            onSubmit={handleEditSubmit}
            onCancel={handleCancelEdit}
            placeholder="New level..."
            name="level"
            index={index}
            inputRef={inputRef}
          />
        ) : (
          <div
            className="flex flex-row w-full justify-between items-center gap-2"
            key={index}
          >
            <Text className="w-full" variant="small" color="foreground">
              {level.name}
            </Text>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button size={'small'} variant="outline">
                  <LucideEllipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-4">
                <DropdownMenuItem onSelect={() => handleEditLevel()}>
                  <LucideSquarePen />
                  <Text color={'foreground'} variant={'medium'}>
                    Edit
                  </Text>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>
                  <LucideTrash2 className="text-error" />
                  <Text color={'destructive'} variant={'medium'}>
                    Delete
                  </Text>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteModalConfirmation
              modalTitle="Delete level"
              deleteButtonText="Confirm deletion"
              deleteIcon="Site"
              index={index}
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              onDelete={(e) => {
                handleCancelLevel(e, index), setIsDeleteModalOpen(false);
              }}
            >
              <Text variant="medium" color={'foreground'}>
                You are about to delete
                <Text variant="medium" color={'foreground'} as="span">
                  {` ${level.name} `}
                </Text>
                from the list. Are you sure you want to delete?
              </Text>
            </DeleteModalConfirmation>
          </div>
        )}
      </div>
    </div>
  );
};
