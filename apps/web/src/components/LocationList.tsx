'use client';
import React, { useState, useEffect, useRef } from 'react';
import { LocationItem } from './LocationItem';
import { Button, Headline, Text } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import { Drive, Location, Role } from '@/gql/graphql';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import {
  isCompanyAdmin,
  isSandvikTechnician,
  isCompanyUser,
} from '@/libs/utils';

type LocationsListProps = {
  selectedDriveId?: string;
  locationsOptions: Location[];
  drivesOptions: Drive[];
  refreshSite: () => void;
};

export const LocationsList = ({
  drivesOptions,
  selectedDriveId,
  locationsOptions,
  refreshSite,
}: LocationsListProps) => {
  const params = useParams();
  const companyId = params.id as string;

  const { data: session } = useSession();
  const isUserSandvikAdmin = session?.user?.globalRole === Role.SandvikAdmin;
  const isUserCompanyAdmin = isCompanyAdmin(
    session?.user?.userPermissions,
    companyId,
  );
  const isUserSandvikTechnician = isSandvikTechnician(
    session?.user?.userPermissions,
    companyId,
  );
  const isUserCompanyUser = isCompanyUser(
    session?.user?.userPermissions,
    companyId,
  );
  const canManage =
    isUserSandvikAdmin ||
    isUserCompanyAdmin ||
    isUserSandvikTechnician ||
    isUserCompanyUser;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [isDeletingLocation, setIsDeletingLocation] = useState<boolean>(false);

  // Add a new empty location
  const addLocation = () => {
    const newLocation: Location = {
      id: '',
      locationName: '',
      driveId: selectedDriveId || '',
      createdAt: undefined,
      updatedAt: undefined,
    };
    setLocations((prevLocations) => [...prevLocations, newLocation]);
  };

  useEffect(() => {
    if (!isDeletingLocation) {
      locationsOptions.length > 0
        ? setLocations(locationsOptions)
        : setLocations([]);
    }
  }, [locationsOptions, isDeletingLocation]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [locations]);

  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="small" color="foreground" isBold>
          Locations
        </Headline>
      </div>
      <div
        className={`flex flex-col gap-1 w-full h-full ${
          canManage ? 'border-y' : 'border-t'
        } py-6 px-6 overflow-auto`}
      >
        {locations.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <Text variant="small" color="foreground">
              {selectedDriveId
                ? 'No locations found for the selected drive'
                : 'Select drive to view available locations'}
            </Text>
          </div>
        )}
        {locations.map((location) => (
          <LocationItem
            key={location.id}
            location={location}
            inputRef={inputRef}
            locationsOptions={locations}
            refreshSite={refreshSite}
            setIsDeletingLocation={setIsDeletingLocation}
          />
        ))}
      </div>
      {canManage && (
        <div className="flex justify-end w-full p-3">
          {selectedDriveId ? (
            <Button
              size={'small'}
              variant={'primary'}
              onClick={addLocation}
              disabled={
                drivesOptions.length === 0 ||
                locations.some((location) => location.locationName === '')
              }
            >
              <LucidePlus /> Add location
            </Button>
          ) : (
            <Button size={'small'} variant={'primary'} disabled>
              <LucidePlus /> Add location
            </Button>
          )}
        </div>
      )}
    </>
  );
};
