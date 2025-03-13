'use client';
import React, { useState } from 'react';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { Text } from '@gsp/ui';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { siteLocationsSchema } from '@/components/SiteLocations/SiteLocationsForm';
import { SiteLocationsValue } from '@/components/SiteLocations/SiteLocationsForm';
import { Drive, Location } from '@/gql/graphql';
interface DriveComponentProps {
  drive: Drive;
  drivesOptions: Drive[];
  index: number;
  selectedDriveId?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSetDrive: (name: string) => void;
  setLocationsOptions: React.Dispatch<React.SetStateAction<Location[]>>;
  setDrivesOptions: React.Dispatch<React.SetStateAction<Drive[]>>;
}

export const DriveItem = ({
  drive,
  drivesOptions,
  selectedDriveId,
  inputRef,
  index,
  setDrivesOptions,
  setLocationsOptions,
  handleSetDrive,
}: DriveComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const driveForm: UseFormReturn<SiteLocationsValue> =
    useForm<SiteLocationsValue>({
      resolver: zodResolver(siteLocationsSchema),
      defaultValues: {
        id: '',
        name: '',
      },
    });

  const handleEditDrive = () => {
    setIsEditing(true);

    driveForm.setValue('name', drive.driveName);
  };

  const handleCancelDrive = (index: number) => {
    const newDrives = [...drivesOptions];
    newDrives[index].locations = [];
    newDrives.splice(index, 1);
    setDrivesOptions(newDrives);

    setLocationsOptions([]);
  };

  const handleEditSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newDriveName = formData.get('drive') as string;

    const isDuplicate = drivesOptions.some(
      (drive) => drive.driveName === newDriveName,
    );

    if (isDuplicate) {
      alert('This drive already exists. Please enter a different drive.');
      return;
    }

    const newDrives = [...drivesOptions];
    newDrives[index] = {
      ...newDrives[index],
      driveName: formData.get('drive') as string,
      locations: [],
    };
    setDrivesOptions(newDrives);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    driveForm.reset();
  };

  return (
    <div
      className={`bg-main-white px-6 ${selectedDriveId === drive.id ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div
        className="py-3"
        onClick={() => !isEditing && handleSetDrive(drive.id)}
      >
        {!drive.driveName || isEditing ? (
          <SiteLocationsForm
            form={driveForm}
            onSubmit={handleEditSubmit}
            onCancel={handleCancelEdit}
            placeholder="New drive..."
            name="drive"
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
              itemSelected={drive.id}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              handleEdit={handleEditDrive}
            />
            <DeleteModalConfirmation
              modalTitle="Delete drive"
              deleteButtonText="Confirm deletion"
              deleteIcon="Site"
              itemToDelete={drive.id}
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              onDelete={() => {
                handleCancelDrive(index), setIsDeleteModalOpen(false);
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
