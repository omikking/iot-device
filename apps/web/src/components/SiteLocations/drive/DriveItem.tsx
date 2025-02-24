import { Text } from '@gsp/ui';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { IDrive } from '@/components/urql-siteslocations/SitesLocationsUrql';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { SiteLocationsValue } from '@/components/SiteLocations/SiteLocationsForm';
import { siteLocationsSchema } from '@/components/SiteLocations/SiteLocationsForm';
import { DriveUpdateUrql } from '@/components/urql-siteslocations/DriveUpdateUrql';

type DriveComponentProps = {
  index: number;
  drive: IDrive;
  drivesOptions: IDrive[];
  selectedDrive?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  isNewDrive?: boolean;
  setNewDriveId?: (id: string | undefined) => void;
  handleSetDrive: (name: string) => void;
};

const deleteDrivesMutation = graphql(`
  mutation removeDrive($id: String!) {
    removeDrive(id: $id) {
      id
      driveName
      levelId
    }
  }
`);

export const DriveItem = ({
  drive,
  drivesOptions,
  selectedDrive,
  inputRef,
  index,
  isNewDrive,
  setNewDriveId,
  handleSetDrive,
}: DriveComponentProps) => {
  const [isEditing, setIsEditing] = useState(isNewDrive);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [, deleteDriveMutation] = useMutation(deleteDrivesMutation);
  const { updateDrive } = DriveUpdateUrql();

  const form = useForm<SiteLocationsValue>({
    resolver: zodResolver(siteLocationsSchema),
    defaultValues: {
      id: drive.id,
      driveName: drive.driveName,
    },
  });

  const deleteDrive = async (id: string) => {
    try {
      const response = await deleteDriveMutation({ id });

      if (response.error) {
        console.error('Mutation error:', response.error);
        return;
      }

      console.log('Mutation response:', response);
    } catch (error) {
      console.error('Error deleting drive:', error);
    }
  };

  useEffect(() => {
    if (isNewDrive) {
      setIsEditing(true);
    }
  }, [isNewDrive]);

  const handleSubmit: SubmitHandler<SiteLocationsValue> = async (formData) => {
    try {
      const isDuplicate = drivesOptions.some(
        (drive) => drive.driveName === formData.driveName,
      );

      if (isDuplicate) {
        alert('This drive already exists. Please enter a different drive.');
        return;
      }

      const result = await updateDrive(drive.id, {
        driveName: formData.driveName || '',
      });

      console.log('update result: ', result);

      if (result) {
        setIsEditing(false);
        if (isNewDrive) {
          setNewDriveId && setNewDriveId(undefined);
        }
      }
    } catch (error) {
      console.error('Error updating drive:', error);
    }
  };

  const handleEditDrive = () => {
    setIsEditing(true);
    form.setValue('driveName', drive.driveName);
  };

  const handleCancelDrive = (index: number) => {
    const newDrives = [...drivesOptions];
    newDrives[index].locations = [];
    newDrives.splice(index, 1);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset();
  };

  return (
    <div
      className={`bg-main-white px-6 ${selectedDrive === drive.driveName ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div
        className="py-3"
        onClick={() => !isEditing && handleSetDrive(drive.driveName)}
      >
        {!drive.driveName || isEditing ? (
          <SiteLocationsForm
            form={form}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            type={'drive'}
            index={index}
            inputRef={inputRef}
          />
        ) : (
          <div
            className="flex flex-row w-full justify-between items-center gap-2"
            key={index}
          >
            <Text className="w-full" variant="small" color="foreground">
              {drive.driveName}
            </Text>

            <DeleteEditDropdown
              itemSelected={index}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              handleEdit={handleEditDrive}
            />
            <DeleteModalConfirmation
              modalTitle="Delete drive"
              deleteButtonText="Confirm deletion"
              deleteIcon="Site"
              itemToDelete={index}
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              onDelete={() => {
                handleCancelDrive(index),
                  setIsDeleteModalOpen(false),
                  deleteDrive(drive.id);
              }}
            >
              <Text variant="medium" color={'foreground'}>
                You are about to delete
                <Text variant="medium" color={'foreground'} as="span" isBold>
                  {` ${drive.driveName} `}
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
