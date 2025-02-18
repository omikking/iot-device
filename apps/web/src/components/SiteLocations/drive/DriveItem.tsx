import { Text } from '@gsp/ui';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { siteLocationsSchema } from '@/components/SiteLocations/SiteLocationsForm';
import { SiteLocationsValue } from '@/components/SiteLocations/SiteLocationsForm';
import { IDrive } from '@/components/SiteLocations/urql-siteslocations/SitesLocationsUrql';

interface DriveComponentProps {
  drive: IDrive;
  drivesOptions: IDrive[];
  index: number;
  selectedDrive?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSetDrive: (name: string) => void;
}

export const DriveItem = ({
  drive,
  drivesOptions,
  selectedDrive,
  inputRef,
  index,
  handleSetDrive,
}: DriveComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const driveForm: UseFormReturn<SiteLocationsValue> =
    useForm<SiteLocationsValue>({
      resolver: zodResolver(siteLocationsSchema),
      defaultValues: {
        id: '',
        driveName: '',
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
      name: formData.get('drive') as string,
      locations: [],
    };
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    driveForm.reset();
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
