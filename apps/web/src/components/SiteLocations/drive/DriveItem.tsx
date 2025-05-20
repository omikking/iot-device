'use client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AddSiteLocationItemForm } from '../AddSiteLocationItemForm';
import { Text } from '@gsp/ui';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { siteLocationsSchema } from '@/components/SiteLocations/AddSiteLocationItemForm';
import { SiteLocationsValue } from '@/components/SiteLocations/AddSiteLocationItemForm';
import { Drive } from '@/gql/graphql';
import { useMutation } from 'urql';
import { graphql } from '@/gql';

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

interface DriveComponentProps {
  drive: Drive;
  drivesOptions: Drive[];
  selectedDriveId?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSetDrive: (drive: Drive) => void;
  refreshSite: () => void;
  setSelectedDrive: Dispatch<SetStateAction<Drive | undefined>>;
}

export const DriveItem = ({
  drive,
  drivesOptions,
  selectedDriveId,
  inputRef,
  handleSetDrive,
  refreshSite,
  setSelectedDrive,
}: DriveComponentProps) => {
  const [isEditing, setIsEditing] = useState(!drive.id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    // @TODO fix these alerts with proper UI
    if (!data.driveName) {
      alert('Please enter a drive name.');
      return;
    }

    // Checks that no other drive has the same name
    const newDriveName = data.driveName;
    const isDuplicate = drivesOptions.some(
      (drive) => drive.driveName === newDriveName,
    );
    if (isDuplicate) {
      alert('This drive already exists. Please enter a different drive.');
      return;
    }

    // To create a new drive
    if (!drive.id && newDriveName) {
      createDrive({
        createDriveInput: {
          driveName: newDriveName,
          levelId: drive.levelId || '',
        },
      }).then((result) => {
        if (result.data) {
          drivesOptions.length === 1 && refreshSite();
          setTimeout(() => setIsEditing(false), 30);
        }
      });
    }

    // To edit a drive
    if (drive.id && newDriveName) {
      updateDrive({
        id: drive.id,
        updateDriveInput: {
          driveName: newDriveName,
        },
      }).then((result) => {
        if (result.data) {
          setTimeout(() => setIsEditing(false), 30);
        }
      });
    }
  };

  const handleDeleteDrive = () => {
    deleteDrive({
      id: drive.id,
    }).then((result) => {
      if (result.data) {
        setSelectedDrive(undefined);
        // @TODO modal should be closed here but is closed somehow anyways. Fix it.
      }
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
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              handleEdit={handleEditDrive}
            />
            <DeleteModalConfirmation
              modalTitle="Delete drive"
              deleteButtonText="Delete drive"
              deleteIcon="Site"
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              onDelete={handleDeleteDrive}
            >
              <Text variant="medium" color={'foreground'}>
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
