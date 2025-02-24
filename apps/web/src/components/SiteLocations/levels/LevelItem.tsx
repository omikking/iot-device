import { Text } from '@gsp/ui';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { ILevel } from '@/components/urql-siteslocations/SitesLocationsUrql';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { SiteLocationsValue } from '@/components/SiteLocations/SiteLocationsForm';
import { siteLocationsSchema } from '@/components/SiteLocations/SiteLocationsForm';
import { LevelUpdateUrql } from '@/components/urql-siteslocations/LevelUpdateUrql';

type LevelComponentProps = {
  level: ILevel;
  index: number;
  selectedLevel?: string;
  levelsOptions: ILevel[];
  inputRef: React.RefObject<HTMLInputElement>;
  isNewLevel?: boolean;
  handleSetLevel: (name: string) => void;
  setNewLevelId?: (id: string | undefined) => void;
};

const deleteLevelsMutation = graphql(`
  mutation removeLevel($id: String!) {
    removeLevel(id: $id) {
      id
      levelName
      siteId
    }
  }
`);

export const LevelItem = ({
  selectedLevel,
  level,
  levelsOptions,
  index,
  inputRef,
  isNewLevel,
  setNewLevelId,
  handleSetLevel,
}: LevelComponentProps) => {
  const [isEditing, setIsEditing] = useState(isNewLevel);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [, deleteLevelMutation] = useMutation(deleteLevelsMutation);
  const { updateLevel } = LevelUpdateUrql();

  const form = useForm<SiteLocationsValue>({
    resolver: zodResolver(siteLocationsSchema),
    defaultValues: {
      id: level.id,
      levelName: level.levelName,
    },
  });

  const deleteLevel = async (id: string) => {
    try {
      const response = await deleteLevelMutation({ id });

      if (response.error) {
        console.error('Mutation error:', response.error);
        return;
      }

      console.log('Mutation response:', response);
    } catch (error) {
      console.error('Error deleting level:', error);
    }
  };

  useEffect(() => {
    if (isNewLevel) {
      setIsEditing(true);
    }
  }, [isNewLevel]);

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
        if (isNewLevel) {
          setNewLevelId && setNewLevelId(undefined);
        }
      }
    } catch (error) {
      console.error('Failed to update level:', error);
    }
  };

  const handleEditLevel = () => {
    console.log('In editing mode');
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
                handleCancelLevel(e, index),
                  setIsDeleteModalOpen(false),
                  deleteLevel(level.id);
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
