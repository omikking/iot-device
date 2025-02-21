import React, { useEffect, useState } from 'react';
import { Text } from '@gsp/ui';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { siteLocationsSchema } from '@/components/SiteLocations/SiteLocationsForm';
import { SiteLocationsValue } from '@/components/SiteLocations/SiteLocationsForm';
import { ILocation } from '@/components/urql-siteslocations/SitesLocationsUrql';
import { LocationUpdateUrql } from '@/components/urql-siteslocations/LocationUpdateUrql';

interface LocationComponentProps {
  index: number;
  location: ILocation;
  locationsOptions: ILocation[];
  inputRef: React.RefObject<HTMLInputElement>;
  isNewLocation?: boolean;
  setNewLocationId?: (id: string | undefined) => void;
  handleSetLocation: (name: string) => void;
}

export const LocationItem = ({
  location,
  index,
  locationsOptions,
  inputRef,
  isNewLocation,
  setNewLocationId,
  handleSetLocation,
}: LocationComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { updateLocation } = LocationUpdateUrql();

  const form = useForm<SiteLocationsValue>({
    resolver: zodResolver(siteLocationsSchema),
    defaultValues: {
      id: location.id,
      locationName: location.locationName,
    },
  });

  useEffect(() => {
    if (isNewLocation) {
      setIsEditing(true);
    }
  }, [isNewLocation]);

  const handleSubmit: SubmitHandler<SiteLocationsValue> = async (formData) => {
    try {
      const isDuplicate = locationsOptions.some(
        (location) => location.locationName === formData.locationName,
      );

      if (isDuplicate) {
        alert(
          'This location already exists. Please enter a different location.',
        );
        return;
      }

      const result = await updateLocation(location.id, {
        locationName: formData.locationName || '',
      });

      console.log('update result: ', result);

      if (result) {
        setIsEditing(false);
        if (isNewLocation) {
          setNewLocationId && setNewLocationId(undefined);
        }
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleEditLocation = () => {
    setIsEditing(true);
    form.setValue('locationName', location.locationName);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset();
  };

  const handleCancelLocation = (index: number) => {
    const newLocations = [...locationsOptions];
    newLocations.splice(index, 1);
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
            form={form}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            type="location"
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
