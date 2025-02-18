import React, { useState } from 'react';
import { Text } from '@gsp/ui';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { siteLocationsSchema } from '@/components/SiteLocations/SiteLocationsForm';
import { SiteLocationsValue } from '@/components/SiteLocations/SiteLocationsForm';
import { ILocation } from '@/components/urql-siteslocations/SitesLocationsUrql';

interface LocationComponentProps {
  location: ILocation;
  index: number;
  locationsOptions: ILocation[];
  inputRef: React.RefObject<HTMLInputElement>;
  handleSetLocation: (name: string) => void;
  // setLocationsOptionsMock: React.Dispatch<React.SetStateAction<ILocation[]>>;
}

export const LocationItem = ({
  location,
  index,
  locationsOptions,
  inputRef,
  // setLocationsOptionsMock,
  handleSetLocation,
}: LocationComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const locationForm: UseFormReturn<SiteLocationsValue> =
    useForm<SiteLocationsValue>({
      resolver: zodResolver(siteLocationsSchema),
      defaultValues: {
        id: '',
        name: '',
      },
    });

  const handleEditLocation = () => {
    setIsEditing(true);
    locationForm.setValue('name', location.locationName);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    locationForm.reset();
  };

  const handleCancelLocation = (index: number) => {
    const newLocations = [...locationsOptions];
    newLocations.splice(index, 1);
    // setLocationsOptionsMock(newLocations);
  };

  const handleEditSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newLocationName = formData.get('location') as string;

    const isDuplicate = locationsOptions.some(
      (location) => location.locationName === newLocationName,
    );

    if (isDuplicate) {
      alert('This location already exists. Please enter a different location.');
      return;
    }

    const newLocations = [...locationsOptions];
    newLocations[index] = {
      ...newLocations[index],
      locationName: newLocationName,
    };
    // setLocationsOptionsMock(newLocations);
    setIsEditing(false);
  };

  return (
    <div
      className={`bg-main-white px-6  'border-2 border-transparent`}
      key={index}
    >
      <div
        className="py-3"
        onClick={() => !isEditing && handleSetLocation(location.locationName)}
      >
        {!location.locationName || isEditing ? (
          <SiteLocationsForm
            form={locationForm}
            onSubmit={handleEditSubmit}
            onCancel={handleCancelEdit}
            placeholder="New location..."
            name="location"
            index={index}
            inputRef={inputRef}
          />
        ) : (
          <div
            className="flex flex-row w-full justify-between items-center gap-2"
            key={index}
          >
            <Text className="w-full" variant="small" color="foreground">
              {location.locationName}
            </Text>
            <DeleteEditDropdown
              itemSelected={index}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              handleEdit={handleEditLocation}
            />
            <DeleteModalConfirmation
              modalTitle="Delete drive"
              deleteButtonText="Confirm deletion"
              deleteIcon="Site"
              itemToDelete={index}
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              onDelete={() => {
                handleCancelLocation(index), setIsDeleteModalOpen(false);
              }}
            >
              <Text variant="medium" color={'foreground'}>
                You are about to delete
                <Text variant="medium" color={'foreground'} as="span" isBold>
                  {` ${location.locationName} `}
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
