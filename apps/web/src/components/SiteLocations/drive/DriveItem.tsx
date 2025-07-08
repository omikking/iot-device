'use client';
import { Text, showAlertToast } from '@gsp/ui';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { Drive } from '@/gql/graphql';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AddSiteLocationItemForm } from '../AddSiteLocationItemForm';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { SiteLocationsValue } from '@/components/SiteLocations/AddSiteLocationItemForm';
import { siteLocationsSchema } from '@/components/SiteLocations/AddSiteLocationItemForm';
import { responses } from '@/app/uitexts/responses';

const createDriveMutation = graphql(`
  mutation createDrive($createDriveInput: CreateDriveInput!) {
    createDrive(createDriveInput: $createDriveInput) {
      id
      driveName
      levelId
    }
  }
`);

const updateDriveMutation = graphql(`
  mutation updateDrive($id: String!, $updateDriveInput: UpdateDriveInput!) {
    updateDrive(id: $id, updateDriveInput: $updateDriveInput) {
      id
      driveName
      levelId
    }
  }
`);

const deleteDriveMutation = graphql(`
  mutation deleteDrive($id: String!) {
    removeDrive(id: $id) {
      id
    }
  }
`);

type DriveComponentProps = {
  drive: Drive;
  drivesOptions: Drive[];
  selectedDriveId?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  refreshSite: () => void;
  handleSetDrive: (drive: Drive) => void;
  setIsDeletingDrive: Dispatch<SetStateAction<boolean>>;
  setSelectedDrive: Dispatch<SetStateAction<Drive | undefined>>;
};

export const DriveItem = ({
  drive,
  inputRef,
  drivesOptions,
  selectedDriveId,
  refreshSite,
  handleSetDrive,
  setSelectedDrive,
  setIsDeletingDrive,
}: DriveComponentProps) => {
  const [isEditing, setIsEditing] = useState(!drive.id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, createDrive] = useMutation(createDriveMutation);
  const [, updateDrive] = useMutation(updateDriveMutation);
  const [, deleteDrive] = useMutation(deleteDriveMutation);

  const driveForm: UseFormReturn<SiteLocationsValue> =
    useForm<SiteLocationsValue>({
      resolver: zodResolver(siteLocationsSchema),
      defaultValues: {
        id: drive.id || '',
        driveName: drive.driveName || '',
      },
    });

  const handleEditDrive = () => {
    setIsEditing(true);
    driveForm.setValue('driveName', drive.driveName);
  };

  const handleCancelEdit = () => {
    if (!drive.id) {
      // @TODO a bug here, check it and solve.
      drivesOptions.filter((emptyDrive) => emptyDrive.id !== drive.id);
      refreshSite();
    }
    driveForm.reset();
    setTimeout(() => setIsEditing(false), 50);
  };

  const handleDriveSubmit: SubmitHandler<SiteLocationsValue> = (data) => {
    if (!data.driveName || data.driveName.trim().length < 2) {
      showAlertToast({
        title: responses.siteLocationWhiteSpaceDriveError,
        variant: 'warning',
      });
      return;
    }

    // Checks that no other drive has the same name
    const newDriveName = data.driveName;
    const isDuplicate = drivesOptions.some(
      (drive) => drive.driveName === newDriveName,
    );
    if (isDuplicate) {
      showAlertToast({
        title: responses.siteLocationDuplicateDriveError,
        description: responses.siteLocationDuplicateDriveMessage,
        variant: 'warning',
      });
      return;
    }

    // To create a new drive
    if (!drive.id && newDriveName) {
      createDrive({
        createDriveInput: {
          driveName: newDriveName,
          levelId: drive.levelId || '',
        },
      })
        .then((result) => {
          if (result.error) {
            showAlertToast({
              title: responses.siteLocationCreateDriveError,
              variant: 'error',
            });
            return;
          }

          if (result.data) {
            showAlertToast({
              title: responses.siteLocationDriveCreateSuccess,
              variant: 'success',
            });
            drivesOptions.length === 1 && refreshSite();
            setTimeout(() => setIsEditing(false), 30);
          }
        })
        .catch(() => {
          showAlertToast({
            title: responses.siteLocationCreateDriveError,
            variant: 'error',
          });
        })
        .finally(() => {});
    }

    // To edit a drive
    if (drive.id && newDriveName) {
      updateDrive({
        id: drive.id,
        updateDriveInput: {
          driveName: newDriveName,
        },
      })
        .then((result) => {
          if (result.error) {
            showAlertToast({
              title: responses.siteLocationDriveUpdateError,
              variant: 'error',
            });
            return;
          }

          if (result.data) {
            showAlertToast({
              title: responses.siteLocationDriveUpdateSuccess,
              variant: 'success',
            });
            setTimeout(() => setIsEditing(false), 30);
          }
        })
        .catch(() => {
          showAlertToast({
            title: responses.siteLocationDriveUpdateError,
            variant: 'error',
          });
        })
        .finally(() => {});
    }
  };

  const handleDeleteDrive = () => {
    setIsDeleting(true);
    setIsDeletingDrive(true);

    return deleteDrive({ id: drive.id })
      .then((result) => {
        if (result.error) {
          showAlertToast({
            title: responses.siteLocationDeleteError,
            variant: 'error',
          });
          setSelectedDrive(undefined);
          return false;
        }
        if (result.data) {
          showAlertToast({
            title: responses.siteLocationDriveDeleteSuccess,
            variant: 'success',
          });
          setSelectedDrive(undefined);
          refreshSite();
        }
        return true;
      })
      .catch(() => {
        showAlertToast({
          title: responses.siteLocationDeleteError,
          variant: 'error',
        });
        return false;
      })
      .finally(() => {
        setIsDeleting(false);

        setTimeout(() => {
          setIsDeletingDrive(false);
        }, 1500);
      });
  };

  return (
    <div
      className={`bg-main-white px-6 cursor-pointer ${selectedDriveId === drive.id ? 'border-2 border-blue-primary' : 'border-2 border-transparent'} ${isEditing && 'bg-main-white/50'}`}
      key={drive.id}
    >
      <div className="py-3" onClick={() => !isEditing && handleSetDrive(drive)}>
        {!drive.id || isEditing ? (
          <AddSiteLocationItemForm
            inputRef={inputRef}
            form={driveForm}
            type="drive"
            onSubmit={handleDriveSubmit}
            onCancel={handleCancelEdit}
          />
        ) : (
          <div
            className="flex flex-row w-full justify-between items-center gap-2"
            key={drive.id}
          >
            <Text variant="medium" color="foreground">
              {drive.driveName}
            </Text>

            <DeleteEditDropdown
              itemSelected={drive.id}
              handleEdit={handleEditDrive}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
            />
            <DeleteModalConfirmation
              deleteIcon="Site"
              modalTitle="Delete drive"
              modalDeleteButtonText="Delete drive"
              isLoading={isDeleting}
              isOpen={isDeleteModalOpen}
              onDelete={handleDeleteDrive}
              onClose={() => setIsDeleteModalOpen(false)}
              onOpenChange={() => setIsDeleteModalOpen(false)}
            >
              <Text
                variant="medium"
                color={'foreground'}
                className="max-w-[450px] text-center"
              >
                You are about to delete drive
                <Text variant="medium" color={'foreground'} as="span" isBold>
                  {` ${drive.driveName} `}
                </Text>
                from your list. This action will also delete all the{' '}
                <Text variant="medium" color={'foreground'} as="span" isBold>
                  locations
                </Text>{' '}
                connected to this drive. Are you sure you want to delete?
              </Text>
            </DeleteModalConfirmation>
          </div>
        )}
      </div>
    </div>
  );
};
