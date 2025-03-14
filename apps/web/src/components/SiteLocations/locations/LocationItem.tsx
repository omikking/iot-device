'use client';
import React, { useState } from 'react';
import { Text } from '@gsp/ui';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddSiteLocationItemForm } from '../AddSiteLocationItemForm';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { siteLocationsSchema } from '@/components/SiteLocations/AddSiteLocationItemForm';
import { SiteLocationsValue } from '@/components/SiteLocations/AddSiteLocationItemForm';
import { Location } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useMutation } from 'urql';

const createLocationMutation = graphql(`
  mutation createLocation($createLocationInput: CreateLocationInput!) {
    createLocation(createLocationInput: $createLocationInput) {
      id
      locationName
      driveId
    }
  }
`);

const updateLocationMutation = graphql(`
  mutation updateLocation(
    $id: String!
    $updateLocationInput: UpdateLocationInput!
  ) {
    updateLocation(id: $id, updateLocationInput: $updateLocationInput) {
      id
      locationName
      driveId
    }
  }
`);

const deleteLocationMutation = graphql(`
  mutation removeLocation($id: String!) {
    removeLocation(id: $id) {
      id
    }
  }
`);

interface LocationComponentProps {
  location: Location;
  locationsOptions: Location[];
  inputRef: React.RefObject<HTMLInputElement>;
}

export const LocationItem = ({
  location,
  locationsOptions,
  inputRef,
}: LocationComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [, createLocation] = useMutation(createLocationMutation);
  const [, updateLocation] = useMutation(updateLocationMutation);
  const [, deleteLocation] = useMutation(deleteLocationMutation);

  const locationForm: UseFormReturn<SiteLocationsValue> =
    useForm<SiteLocationsValue>({
      resolver: zodResolver(siteLocationsSchema),
      defaultValues: {
        id: '',
        locationName: '',
      },
    });

  const handleEditLocation = () => {
    setIsEditing(true);
    locationForm.setValue('locationName', location.locationName);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    locationForm.reset();
  };

  const handleLocationSubmit: SubmitHandler<SiteLocationsValue> = (data) => {
    // @TODO fix these alerts with proper UI
    if (!data.locationName) {
      alert('Please enter a location name.');
      return;
    }

    // Checks that no other location has the same name
    const newLocationName = data.locationName;
    const isDuplicate = locationsOptions.some(
      (location) => location.locationName === newLocationName,
    );
    if (isDuplicate) {
      alert('This location already exists. Please enter a different location.');
      return;
    }

    // To create a new location
    if (!location.id && newLocationName) {
      createLocation({
        createLocationInput: {
          locationName: newLocationName,
          driveId: location.driveId || '',
        },
      }).then((result) => {
        if (result.data) {
          setIsEditing(false);
        }
      });
    }

    // To edit a location
    if (location.id && newLocationName) {
      updateLocation({
        id: location.id,
        updateLocationInput: {
          locationName: newLocationName,
        },
      }).then((result) => {
        if (result.data) {
          setIsEditing(false);
        }
      });
    }
  };

  const handleDeleteLocation = () => {
    deleteLocation({
      id: location.id,
    }).then((result) => {
      if (result.data) {
        setIsDeleteModalOpen(false);
      }
    });
  };

  return (
    <div
      className={`bg-main-white px-6  'border-2 border-transparent`}
      key={location.id}
    >
      <div className="py-3">
        {!location.locationName || isEditing ? (
          <AddSiteLocationItemForm
            form={locationForm}
            onSubmit={handleLocationSubmit}
            onCancel={handleCancelEdit}
            type="location"
            inputRef={inputRef}
          />
        ) : (
          <div
            className="flex flex-row w-full justify-between items-center gap-2"
            key={location.id}
          >
            <Text variant="medium" color="foreground">
              {location.locationName}
            </Text>
            <DeleteEditDropdown
              itemSelected={location.id}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              handleEdit={handleEditLocation}
            />
            <DeleteModalConfirmation
              modalTitle="Delete drive"
              deleteButtonText="Delete drive"
              deleteIcon="Site"
              itemToDelete={location.id}
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              onDelete={handleDeleteLocation}
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
