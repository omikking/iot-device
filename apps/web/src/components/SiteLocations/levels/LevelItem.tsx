import React, { useState } from 'react';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { Text } from '@gsp/ui';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { siteLocationsSchema } from '@/components/SiteLocations/SiteLocationsForm';
import { SiteLocationsValue } from '@/components/SiteLocations/SiteLocationsForm';
import { ILevel } from '@/components/urql-siteslocations/SitesLocationsUrql';

interface LevelComponentProps {
  selectedLevel?: string;
  level: ILevel;
  levelsOptions: ILevel[];
  index: number;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSetLevel: (name: string) => void;
}

export const LevelItem = ({
  selectedLevel,
  level,
  levelsOptions,
  index,
  inputRef,
  handleSetLevel,
}: LevelComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const levelForm: UseFormReturn<SiteLocationsValue> =
    useForm<SiteLocationsValue>({
      resolver: zodResolver(siteLocationsSchema),
      defaultValues: {
        id: '',
        name: '',
      },
    });

  const handleEditLevel = () => {
    setIsEditing(true);
    levelForm.setValue('name', level.levelName);
  };

  const handleEditSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    const formData = new FormData(e.currentTarget);
    const newLevelName = formData.get('level') as string;

    const isDuplicate = levelsOptions.some(
      (level) => level.levelName === newLevelName,
    );

    if (isDuplicate) {
      alert('This level already exists. Please enter a different level.');
      return;
    }

    const newLevels = [...levelsOptions];
    newLevels[index] = {
      ...newLevels[index],
      levelName: newLevelName,
    };

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    levelForm.reset();
  };

  const handleCancelLevel = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const newLevels = [...levelsOptions];
    newLevels[index].drives = [];
    newLevels.splice(index, 1);
  };

  return (
    <div
      className={`bg-main-white px-6 ${selectedLevel === level.levelName ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div
        className="py-3"
        onClick={() => !isEditing && handleSetLevel(level.levelName)}
      >
        {!level.levelName || isEditing ? (
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
              {level.levelName}
            </Text>

            <DeleteEditDropdown
              itemSelected={index}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              handleEdit={handleEditLevel}
            />
            <DeleteModalConfirmation
              modalTitle="Delete level"
              deleteButtonText="Confirm deletion"
              deleteIcon="Site"
              itemToDelete={index}
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              onDelete={(e) => {
                handleCancelLevel(e, index), setIsDeleteModalOpen(false);
              }}
            >
              <Text variant="medium" color={'foreground'}>
                You are about to delete
                <Text variant="medium" color={'foreground'} as="span" isBold>
                  {` ${level.levelName} `}
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
