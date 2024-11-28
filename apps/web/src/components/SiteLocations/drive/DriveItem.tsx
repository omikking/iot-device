import React, { useState } from 'react';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { Text } from '@gsp/ui';
import { IDriveMock, ILocationMock } from '@/app/(routes)/sitelocations/page';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { siteLocationsSchema } from '@/components/SiteLocations/SiteLocationsForm';
import { SiteLocationsValue } from '@/components/SiteLocations/SiteLocationsForm';
interface DriveComponentProps {
  drive: IDriveMock;
  drivesOptionsMock: IDriveMock[];
  index: number;
  selectedDrive?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  // @TODO Gives error but it works. investigate why.
  // eslint-disable-next-line no-unused-vars
  handleSetDrive: (name: string) => void;
  setLocationsOptionsMock: React.Dispatch<
    React.SetStateAction<ILocationMock[]>
  >;
  setDrivesOptionsMock: React.Dispatch<React.SetStateAction<IDriveMock[]>>;
}

export const DriveItem = ({
  drive,
  drivesOptionsMock,
  selectedDrive,
  inputRef,
  index,
  setDrivesOptionsMock,
  setLocationsOptionsMock,
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

    driveForm.setValue('name', drive.name);
  };

  const handleCancelDrive = (index: number) => {
    const newDrives = [...drivesOptionsMock];
    newDrives[index].locations = [];
    newDrives.splice(index, 1);
    setDrivesOptionsMock(newDrives);

    setLocationsOptionsMock([]);
  };

  const handleEditSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newDriveName = formData.get('drive') as string;

    const isDuplicate = drivesOptionsMock.some(
      (drive) => drive.name === newDriveName,
    );

    if (isDuplicate) {
      alert('This drive already exists. Please enter a different drive.');
      return;
    }

    const newDrives = [...drivesOptionsMock];
    newDrives[index] = {
      ...newDrives[index],
      name: formData.get('drive') as string,
      locations: [],
    };
    setDrivesOptionsMock(newDrives);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    driveForm.reset();
  };

  return (
    <div
      className={`bg-main-white px-6 ${selectedDrive === drive.name ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div
        className="py-3"
        onClick={() => !isEditing && handleSetDrive(drive.name)}
      >
        {!drive.name || isEditing ? (
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
              {drive.name}
            </Text>

            <DeleteEditDropdown
              itemToDelete={index}
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
                  {` ${drive.name} `}
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
