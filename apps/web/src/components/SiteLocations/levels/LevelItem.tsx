'use client';
import { Text } from '@gsp/ui';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { Drive, Level } from '@/gql/graphql';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AddSiteLocationItemForm } from '../AddSiteLocationItemForm';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { SiteLocationsValue } from '@/components/SiteLocations/AddSiteLocationItemForm';
import { siteLocationsSchema } from '@/components/SiteLocations/AddSiteLocationItemForm';

const createLevelMutation = graphql(`
  mutation createLevel($createLevelInput: CreateLevelInput!) {
    createLevel(createLevelInput: $createLevelInput) {
      id
      levelName
      siteId
    }
  }
`);

const updateLevelMutation = graphql(`
  mutation updateLevel($id: String!, $updateLevelInput: UpdateLevelInput!) {
    updateLevel(id: $id, updateLevelInput: $updateLevelInput) {
      id
      levelName
      siteId
    }
  }
`);

const deleteLevelMutation = graphql(`
  mutation deleteLevel($id: String!) {
    removeLevel(id: $id) {
      id
    }
  }
`);

type LevelComponentProps = {
  selectedLevelId?: string;
  level: Level;
  levelsOptions: Level[];
  inputRef: React.RefObject<HTMLInputElement>;
  setIsDeletingLevel: Dispatch<SetStateAction<boolean>>;
  handleSetLevel: (level: Level) => void;
  refreshSite: () => void;
  setSelectedLevel: Dispatch<SetStateAction<Level | undefined>>;
  setSelectedDrive: Dispatch<SetStateAction<Drive | undefined>>;
};

export const LevelItem = ({
  selectedLevelId,
  level,
  levelsOptions,
  inputRef,
  setIsDeletingLevel,
  handleSetLevel,
  refreshSite,
  setSelectedLevel,
}: LevelComponentProps) => {
  const [isEditing, setIsEditing] = useState(!level.id);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, createLevel] = useMutation(createLevelMutation);
  const [, updateLevel] = useMutation(updateLevelMutation);
  const [, deleteLevel] = useMutation(deleteLevelMutation);

  const levelForm: UseFormReturn<SiteLocationsValue> =
    useForm<SiteLocationsValue>({
      resolver: zodResolver(siteLocationsSchema),
      defaultValues: {
        id: level.id || '',
        levelName: level.levelName || '',
      },
    });

  const handleEditLevel = () => {
    setIsEditing(true);
    levelForm.setValue('levelName', level.levelName);
  };

  const handleCancelEdit = () => {
    if (!level.id) {
      levelsOptions.filter((emptyLevel) => emptyLevel.id !== level.id);
      refreshSite();
    }
    levelForm.reset();
    setTimeout(() => setIsEditing(false), 50);
  };

  const handleLevelSubmit: SubmitHandler<SiteLocationsValue> = (data) => {
    // @TODO fix these alerts with proper UI
    if (!data.levelName) {
      alert('Please enter a level name.');
      return;
    }

    const newLevelName = data.levelName;
    const isDuplicate = levelsOptions.some(
      (level) => level.levelName === newLevelName,
    );
    if (isDuplicate) {
      alert('This level already exists. Please enter a different level.');
      return;
    }

    // To create a new level
    if (!level.id && newLevelName) {
      createLevel({
        createLevelInput: {
          levelName: newLevelName,
          siteId: level.siteId || '',
        },
      })
        .then((result) => {
          if (result.data) {
            levelsOptions.length === 1 && refreshSite();
            setTimeout(() => setIsEditing(false), 30);
          }
        })
        .catch((error) => {
          console.error('Error creating level:', error);
        })
        .finally(() => {
          console.log('Creation process completed');
        });
    }

    // To edit a level
    if (level.id && newLevelName) {
      updateLevel({
        id: level.id,
        updateLevelInput: {
          levelName: newLevelName,
        },
      })
        .then((result) => {
          if (result.data) {
            setTimeout(() => setIsEditing(false), 30);
          }
        })
        .catch((error) => {
          console.error('Error updating level:', error);
        })
        .finally(() => {
          console.log('Update process completed');
        });
    }
  };

  const handleDeleteLevel = () => {
    setIsDeleting(true);
    setIsDeletingLevel(true);

    return deleteLevel({ id: level.id })
      .then((result) => {
        if (result.error) {
          setSelectedLevel(undefined);
          return false;
        }
        return true;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        setIsDeleting(false);

        setTimeout(() => {
          setIsDeletingLevel(false);
        }, 1500);
      });
  };

  return (
    <div
      className={`bg-main-white px-6 cursor-pointer ${selectedLevelId === level.id ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'} ${isEditing && 'bg-main-white/50'}`}
      key={level.id}
    >
      <div className="py-3" onClick={() => !isEditing && handleSetLevel(level)}>
        {!level.id || isEditing ? (
          <AddSiteLocationItemForm
            inputRef={inputRef}
            form={levelForm}
            type="level"
            onSubmit={handleLevelSubmit}
            onCancel={handleCancelEdit}
          />
        ) : (
          <div
            className="flex flex-row w-full justify-between items-center gap-2"
            key={level.id}
          >
            <Text variant="medium" color="foreground">
              {level.levelName}
            </Text>

            <DeleteEditDropdown
              itemSelected={level.id}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              handleEdit={handleEditLevel}
            />
            <DeleteModalConfirmation
              deleteIcon="Site"
              modalTitle="Delete level"
              modalDeleteButtonText="Delete level"
              isLoading={isDeleting}
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onDelete={handleDeleteLevel}
              onOpenChange={() => setIsDeleteModalOpen(false)}
            >
              <Text
                variant="medium"
                color={'foreground'}
                className="max-w-[450px] text-center"
              >
                You are about to delete level
                <Text variant="medium" color={'foreground'} as="span" isBold>
                  {` ${level.levelName} `}
                </Text>
                from your list. This action will also delete all the{' '}
                <Text variant="medium" color={'foreground'} as="span" isBold>
                  drives
                </Text>{' '}
                and{' '}
                <Text variant="medium" color={'foreground'} as="span" isBold>
                  locations
                </Text>{' '}
                connected to this level. Are you sure you want to delete?
              </Text>
            </DeleteModalConfirmation>
          </div>
        )}
      </div>
    </div>
  );
};
