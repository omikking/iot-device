'use client';
import { showAlertToast, Text } from '@gsp/ui';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { Location } from '@/gql/graphql';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { AddSiteLocationItemForm } from '../AddSiteLocationItemForm';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { SiteLocationsValue } from '@/components/SiteLocations/AddSiteLocationItemForm';
import { siteLocationsSchema } from '@/components/SiteLocations/AddSiteLocationItemForm';
import { responses } from '@/app/uitexts/responses';

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
  mutation deleteLocation($id: String!) {
    removeLocation(id: $id) {
      id
    }
  }
`);

type LocationComponentProps = {
  location: Location;
  locationsOptions: Location[];
  inputRef: React.RefObject<HTMLInputElement>;
  refreshSite: () => void;
  setIsDeletingLocation: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LocationItem = ({
  location,
  inputRef,
  locationsOptions,
  refreshSite,
  setIsDeletingLocation,
}: LocationComponentProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(!location.id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [, createLocation] = useMutation(createLocationMutation);
  const [, updateLocation] = useMutation(updateLocationMutation);
  const [, deleteLocation] = useMutation(deleteLocationMutation);

  const locationForm: UseFormReturn<SiteLocationsValue> =
    useForm<SiteLocationsValue>({
      resolver: zodResolver(siteLocationsSchema),
      defaultValues: {
        id: location.id || '',
        locationName: location.locationName || '',
      },
    });

  const handleEditLocation = () => {
    setIsEditing(true);
    locationForm.setValue('locationName', location.locationName);
  };

  const handleCancelEdit = () => {
    if (!location.id) {
      locationsOptions.filter(
        (emptyLocation) => emptyLocation.id !== location.id,
      );
      refreshSite();
    }
    locationForm.reset();
    setTimeout(() => setIsEditing(false), 50);
  };

  const handleLocationSubmit: SubmitHandler<SiteLocationsValue> = (data) => {
    if (!data.locationName || data.locationName.trim().length < 2) {
      showAlertToast({
        title: responses.siteLocationWhiteSpaceLocationError,
        variant: 'warning',
      });
      return;
    }

    // Checks that no other location has the same name
    const newLocationName = data.locationName;
    const isDuplicate = locationsOptions.some(
      (location) => location.locationName === newLocationName,
    );
    if (isDuplicate) {
      showAlertToast({
        title: responses.siteLocationDuplicateLocationError,
        description: responses.siteLocationDuplicateLocationMessage,
        variant: 'warning',
      });
      return;
    }

    // To create a new location
    if (!location.id && newLocationName) {
      createLocation({
        createLocationInput: {
          locationName: newLocationName,
          driveId: location.driveId || '',
        },
      })
        .then((result) => {
          // Backend errors
          if (result.error) {
            showAlertToast({
              title: responses.siteLocationCreateLocationError,
              variant: 'error',
            });
            return;
          }

          if (result.data) {
            showAlertToast({
              title: responses.siteLocationLocationCreateSuccess,
              variant: 'success',
            });
            setTimeout(() => setIsEditing(false), 30);
            locationsOptions.length === 1 && refreshSite();
          }
        })
        .catch(() => {
          showAlertToast({
            title: responses.siteLocationCreateLocationError,
            variant: 'error',
          });
        })
        .finally(() => {});
    }

    // To edit a location
    if (location.id && newLocationName) {
      updateLocation({
        id: location.id,
        updateLocationInput: {
          locationName: newLocationName,
        },
      })
        .then((result) => {
          if (result.error) {
            showAlertToast({
              title: responses.siteLocationLocationUpdateError,
              variant: 'error',
            });
            return;
          }

          if (result.data) {
            showAlertToast({
              title: responses.siteLocationLocationUpdateSuccess,
              variant: 'success',
            });
            setTimeout(() => setIsEditing(false), 30);
          }
        })
        .catch(() => {
          showAlertToast({
            title: responses.siteLocationLocationUpdateError,
            variant: 'error',
          });
        })
        .finally(() => {});
    }
  };

  const handleDeleteLocation = () => {
    setIsDeleting(true);
    setIsDeletingLocation(true);

    return deleteLocation({
      id: location.id,
    })
      .then((result) => {
        if (result.error?.graphQLErrors) {
          showAlertToast({
            title: responses.siteLocationDeleteError,
            variant: 'error',
          });
          setIsDeletingLocation(false);
          return false;
        }
        // Success
        if (result.data) {
          showAlertToast({
            title: responses.siteLocationLocationDeleteSuccess,
            variant: 'success',
          });
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
          setIsDeletingLocation(false);
        }, 1500);
      });
  };

  return (
    <div
      className={`bg-main-white px-6 border-2 border-transparent ${isEditing && 'bg-main-white/50'}`}
      key={location.id}
    >
      <div className="py-3">
        {!location.id || isEditing ? (
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
              handleEdit={handleEditLocation}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
            />
            <DeleteModalConfirmation
              deleteIcon="Site"
              modalTitle="Delete location"
              modalDeleteButtonText="Delete location"
              isLoading={isDeleting}
              isOpen={isDeleteModalOpen}
              onDelete={handleDeleteLocation}
              onClose={() => setIsDeleteModalOpen(false)}
              onOpenChange={() => setIsDeleteModalOpen(false)}
            >
              <Text variant="medium" color={'foreground'}>
                You are about to delete location{' '}
                <Text variant="medium" color={'foreground'} as="span" isBold>
                  {` ${location.locationName} `}
                </Text>{' '}
                from your list. Are you sure you want to delete?
              </Text>
            </DeleteModalConfirmation>
          </div>
        )}
      </div>
    </div>
  );
};
