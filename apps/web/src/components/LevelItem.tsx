'use client';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { Drive, Level, Role } from '@/gql/graphql';
import { Text, showAlertToast } from '@gsp/ui';
import { responses } from '@/app/uitexts/responses';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AddSiteLocationItemForm } from '@/components/AddSiteLocationItemForm';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import {
  LevelValue,
  siteLocationsSchema,
} from '@/components/schemas/SiteLocationsFormSchema';
import {
  handleGraphQLErrors,
  isCompanyAdmin,
  isCompanyUser,
  isSandvikTechnician,
} from '@/libs/utils';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

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
  const params = useParams();
  const companyId = params.id as string;

  const { data: session } = useSession();
  const isUserSandvikAdmin = session?.user?.globalRole === Role.SandvikAdmin;
  const isUserCompanyAdmin = isCompanyAdmin(
    session?.user?.userPermissions,
    companyId,
  );
  const isUserSandvikTechnician = isSandvikTechnician(
    session?.user?.userPermissions,
    companyId,
  );
  const isUserCompanyUser = isCompanyUser(
    session?.user?.userPermissions,
    companyId,
  );
  const canManage =
    isUserSandvikAdmin ||
    isUserCompanyAdmin ||
    isUserSandvikTechnician ||
    isUserCompanyUser;
  const canDelete =
    isUserSandvikAdmin || isUserCompanyAdmin || isUserSandvikTechnician;

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
          handleGraphQLErrors(result.error);

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
          handleGraphQLErrors(result.error);

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
          const hasGraphQLErrors = handleGraphQLErrors(result.error);
          if (hasGraphQLErrors) {
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
      className={`bg-main-white px-6 cursor-pointer flex items-center h-16 ${selectedLevelId === level.id ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'} ${isEditing && 'bg-main-white/50'}`}
      key={level.id}
    >
      <div
        className="py-3 w-full"
        onClick={() => !isEditing && handleSetLevel(level)}
      >
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

            {canManage && (
              <DeleteEditDropdown
                itemSelected={level.id}
                handleEdit={handleEditLevel}
                openDeleteModal={
                  canDelete ? () => setIsDeleteModalOpen(true) : undefined
                }
              />
            )}

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
