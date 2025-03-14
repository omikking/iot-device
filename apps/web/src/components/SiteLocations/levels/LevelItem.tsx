'use client';
import React, { useState } from 'react';
import { AddSiteLocationItemForm } from '../AddSiteLocationItemForm';
import { Text } from '@gsp/ui';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { siteLocationsSchema } from '@/components/SiteLocations/AddSiteLocationItemForm';
import { SiteLocationsValue } from '@/components/SiteLocations/AddSiteLocationItemForm';
import { Level } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useMutation } from 'urql';

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
  mutation removeLevel($id: String!) {
    removeLevel(id: $id) {
      id
    }
  }
`);

interface LevelComponentProps {
  selectedLevelId?: string;
  level: Level;
  levelsOptions: Level[];
  inputRef: React.RefObject<HTMLInputElement>;
  handleSetLevel: (name: string) => void;
}

export const LevelItem = ({
  selectedLevelId,
  level,
  levelsOptions,
  inputRef,
  handleSetLevel,
}: LevelComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [, createLevel] = useMutation(createLevelMutation);
  const [, updateLevel] = useMutation(updateLevelMutation);
  const [, deleteLevel] = useMutation(deleteLevelMutation);

  const levelForm: UseFormReturn<SiteLocationsValue> =
    useForm<SiteLocationsValue>({
      resolver: zodResolver(siteLocationsSchema),
      defaultValues: {
        id: '',
        levelName: '',
      },
    });

  const handleEditLevel = () => {
    setIsEditing(true);
    levelForm.setValue('levelName', level.levelName);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    levelForm.reset();
  };

  const handleLevelSubmit: SubmitHandler<SiteLocationsValue> = (data) => {
    // @TODO fix these alerts with proper UI
    if (!data.levelName) {
      alert('Please enter a level name.');
      return;
    }

    // Checks that no other level has the same name
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
      }).then((result) => {
        if (result.data) {
          setIsEditing(false);
        }
      });
    }

    // To edit a level
    if (level.id && newLevelName) {
      updateLevel({
        id: level.id,
        updateLevelInput: {
          levelName: newLevelName,
        },
      }).then((result) => {
        if (result.data) {
          setIsEditing(false);
        }
      });
    }
  };

  const handleDeleteLevel = () => {
    deleteLevel({
      id: level.id,
    }).then((result) => {
      if (result.data) {
        setIsDeleteModalOpen(false);
      }
    });
    // @TODO Cannot delete level with items in, need to fix in BE to clear it all. Will fail atm.
    // Double check later if this is needed.
    // setDrivesOptions([]);
    // setLocationsOptions([]);
  };

  return (
    <div
      className={`bg-main-white px-6 ${selectedLevelId === level.id ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={level.id}
    >
      <div
        className="py-3"
        onClick={() => !isEditing && handleSetLevel(level.id)}
      >
        {!level.levelName || isEditing ? (
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
              modalTitle="Delete level"
              deleteButtonText="Delete level"
              deleteIcon="Site"
              itemToDelete={level.id}
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              onDelete={handleDeleteLevel}
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
