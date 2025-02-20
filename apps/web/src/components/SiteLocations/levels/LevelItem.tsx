import React, { useState } from 'react';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { Text } from '@gsp/ui';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { siteLocationsSchema } from '@/components/SiteLocations/SiteLocationsForm';
import { SiteLocationsValue } from '@/components/SiteLocations/SiteLocationsForm';
import { ILevel } from '@/components/urql-siteslocations/SitesLocationsUrql';
import { LevelUpdateUrql } from '@/components/urql-siteslocations/LevelUpdateUrql';

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
  const { updateLevel } = LevelUpdateUrql();

  const form = useForm<SiteLocationsValue>({
    resolver: zodResolver(siteLocationsSchema),
    defaultValues: {
      id: level.id,
      levelName: level.levelName,
    },
  });

  const handleSubmit: SubmitHandler<SiteLocationsValue> = async (formData) => {
    try {
      const isDuplicate = levelsOptions.some(
        (level) => level.levelName === formData.levelName,
      );

      if (isDuplicate) {
        alert('This level already exists. Please enter a different level.');
        return;
      }

      const result = await updateLevel(level.id, {
        levelName: formData.levelName || '',
      });
      console.log('update result: ', result);
      if (result) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update level:', error);
    }
  };

  const handleEditLevel = () => {
    setIsEditing(true);
    form.setValue('levelName', level.levelName);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset();
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
            form={form}
            type="level"
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
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
