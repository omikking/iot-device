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
import { responses } from '@/app/uitexts/responses';
import {
  LocationValue,
  siteLocationsSchema,
} from '@/components/schemas/SiteLocationsFormSchema';
import { GraphQLErrorExtensions } from '@/libs/utils';

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

  const locationForm: UseFormReturn<LocationValue> = useForm<LocationValue>({
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

  const handleLocationSubmit: SubmitHandler<LocationValue> = (data) => {
    // Create a location
    if (!location.id) {
      createLocation({
        createLocationInput: {
          locationName: data.locationName,
          driveId: location.driveId || '',
        },
      })
        .then((result) => {
          // Backend errors
          if (result.error?.graphQLErrors) {
            const { title, message, type } = result.error.graphQLErrors[0]
              .extensions as unknown as GraphQLErrorExtensions;

            showAlertToast({
              title: title,
              description: message,
              variant: type || 'error',
            });
          }
          // Success
          if (result.data) {
            showAlertToast({
              title: responses.locationCreateSuccess,
              variant: 'success',
            });
            locationsOptions.length === 1 && refreshSite();
            setTimeout(() => setIsEditing(false), 30);
          }
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.locationCreateError,
            description: responses.contactSupportError,
            variant: 'error',
          });
        });
    }

    // To edit a location
    if (location.id) {
      updateLocation({
        id: location.id,
        updateLocationInput: {
          locationName: data.locationName,
        },
      })
        .then((result) => {
          // Backend errors
          if (result.error?.graphQLErrors) {
            const { title, message, type } = result.error.graphQLErrors[0]
              .extensions as unknown as GraphQLErrorExtensions;

            showAlertToast({
              title: title,
              description: message,
              variant: type || 'error',
            });
          }
          // Success
          if (result.data) {
            showAlertToast({
              title: responses.locationUpdateSuccess,
              variant: 'success',
            });
            setTimeout(() => setIsEditing(false), 30);
          }
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.locationUpdateError,
            description: responses.contactSupportError,
            variant: 'error',
          });
        });
    }
  };

  const handleDeleteLocation = () => {
    setIsDeleting(true);
    setIsDeletingLocation(true);

    return (
      deleteLocation({
        id: location.id,
      })
        .then((result) => {
          // Backend errors
          if (result.error?.graphQLErrors) {
            const { title, message, type } = result.error.graphQLErrors[0]
              .extensions as unknown as GraphQLErrorExtensions;

            showAlertToast({
              title: title,
              description: message,
              variant: type || 'error',
            });
            setIsDeletingLocation(false);
            return false;
          }
          // Success
          if (result.data) {
            showAlertToast({
              title: responses.locationDeleteSuccess,
              variant: 'info',
            });
          }
          return true;
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.locationDeleteError,
            description: responses.contactSupportError,
            variant: 'error',
          });
          return false;
        })
        .finally(() => {
          setIsDeleting(false);

          setTimeout(() => {
            setIsDeletingLocation(false);
          }, 1500);
        })
    );
  };

  return (
    <div
      className={`bg-main-white px-6 border-2 border-transparent ${isEditing && 'bg-main-white/50'}`}
      key={location.id}
    >
      <div className="py-3">
        {!location.id || isEditing ? (
          <AddSiteLocationItemForm<'location'>
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
