'use client';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { Drive, Level } from '@/gql/graphql';
import { Text, showAlertToast } from '@gsp/ui';
import { responses } from '@/app/uitexts/responses';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AddSiteLocationItemForm } from '../AddSiteLocationItemForm';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import {
  LevelValue,
  siteLocationsSchema,
} from '@/components/schemas/SiteLocationsFormSchema';
import { GraphQLErrorExtensions } from '@/libs/utils';

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
  level: Level;
  levelsOptions: Level[];
  selectedLevelId?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  refreshSite: () => void;
  handleSetLevel: (level: Level) => void;
  setIsDeletingLevel: Dispatch<SetStateAction<boolean>>;
  setSelectedLevel: Dispatch<SetStateAction<Level | undefined>>;
  setSelectedDrive: Dispatch<SetStateAction<Drive | undefined>>;
};

export const LevelItem = ({
  level,
  inputRef,
  levelsOptions,
  selectedLevelId,
  refreshSite,
  handleSetLevel,
  setSelectedLevel,
  setIsDeletingLevel,
}: LevelComponentProps) => {
  const [isEditing, setIsEditing] = useState(!level.id);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, createLevel] = useMutation(createLevelMutation);
  const [, updateLevel] = useMutation(updateLevelMutation);
  const [, deleteLevel] = useMutation(deleteLevelMutation);

  const levelForm: UseFormReturn<LevelValue> = useForm<LevelValue>({
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

  const handleLevelSubmit: SubmitHandler<LevelValue> = (data) => {
    // Create a level
    if (!level.id) {
      createLevel({
        createLevelInput: {
          levelName: data.levelName,
          siteId: level.siteId || '',
        },
      })
        .then((result) => {
          // Backend errors
          if (result.error?.graphQLErrors) {
            const { title, message, type } = result.error.graphQLErrors[0]
              .extensions as unknown as GraphQLErrorExtensions;

            showAlertToast({
              title: title,
              description: message,
              variant: type || 'error',
            });
          }
          // Success
          if (result.data) {
            showAlertToast({
              title: responses.levelCreateSuccess,
              variant: 'success',
            });
            levelsOptions.length === 1 && refreshSite();
            setTimeout(() => setIsEditing(false), 30);
          }
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.levelCreateError,
            description: responses.contactSupportError,
            variant: 'error',
          });
        });
    }

    // Edit a level
    if (level.id) {
      updateLevel({
        id: level.id,
        updateLevelInput: {
          levelName: data.levelName,
        },
      })
        .then((result) => {
          // Backend errors
          if (result.error?.graphQLErrors) {
            const { title, message, type } = result.error.graphQLErrors[0]
              .extensions as unknown as GraphQLErrorExtensions;

            showAlertToast({
              title: title,
              description: message,
              variant: type || 'error',
            });
          }
          // Success
          if (result.data) {
            showAlertToast({
              title: responses.levelUpdateSuccess,
              variant: 'success',
            });
            setTimeout(() => setIsEditing(false), 30);
          }
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.levelUpdateError,
            description: responses.contactSupportError,
            variant: 'error',
          });
        });
    }
  };

  const handleDeleteLevel = () => {
    setIsDeleting(true);
    setIsDeletingLevel(true);

    return (
      deleteLevel({ id: level.id })
        .then((result) => {
          // Backend errors
          if (result.error?.graphQLErrors) {
            const { title, message, type } = result.error.graphQLErrors[0]
              .extensions as unknown as GraphQLErrorExtensions;

            showAlertToast({
              title: title,
              description: message,
              variant: type || 'error',
            });
            setSelectedLevel(undefined);
            return false;
          }
          // Success
          if (result.data) {
            setTimeout(() => {
              showAlertToast({
                title: responses.levelDeleteSuccess,
                variant: 'info',
              });
              setSelectedLevel(undefined);
              refreshSite();
            }, 1200);
          }
          return true;
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.levelDeleteError,
            description: responses.contactSupportError,
            variant: 'error',
          });
          return false;
        })
        .finally(() => {
          setIsDeleting(false);

          setTimeout(() => {
            setIsDeletingLevel(false);
          }, 1500);
        })
    );
  };

  return (
    <div
      className={`bg-main-white px-6 cursor-pointer ${selectedLevelId === level.id ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'} ${isEditing && 'bg-main-white/50'}`}
      key={level.id}
    >
      <div className="py-3" onClick={() => !isEditing && handleSetLevel(level)}>
        {!level.id || isEditing ? (
          <AddSiteLocationItemForm<'level'>
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
              handleEdit={handleEditLevel}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
            />
            <DeleteModalConfirmation
              deleteIcon="Site"
              modalTitle="Delete level"
              modalDeleteButtonText="Delete level"
              isLoading={isDeleting}
              isOpen={isDeleteModalOpen}
              onDelete={handleDeleteLevel}
              onClose={() => setIsDeleteModalOpen(false)}
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
