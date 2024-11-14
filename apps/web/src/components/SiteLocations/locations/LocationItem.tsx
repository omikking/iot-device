import { z } from 'zod';
import React from 'react';
import { Button, Text } from '@gsp/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideEllipsis, LucideX } from 'lucide-react';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { ILocationMock } from '@/app/(routes)/sitelocations/page';

interface LocationComponentProps {
  location: ILocationMock;
  index: number;
  locationsOptionsMock: ILocationMock[];
  inputRef: React.RefObject<HTMLInputElement>;
  setLocationsOptionsMock: React.Dispatch<
    React.SetStateAction<ILocationMock[]>
  >;
}

export const LocationItem = ({
  location,
  index,
  locationsOptionsMock,
  setLocationsOptionsMock,
  inputRef,
}: LocationComponentProps) => {
  const locationFormSchema = z.object({
    id: z.string(),
    name: z.string(),
  });

  const locationForm = useForm<z.infer<typeof locationFormSchema>>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      id: '',
      name: '',
    },
  });

  const handleCancelLocation = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.preventDefault();

    const newLocations = [...locationsOptionsMock];
    newLocations.splice(index, 1);
    setLocationsOptionsMock(newLocations);
  };
  const handleSubmitLocation = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newLocationName = formData.get('location') as string;

    const isDuplicate = locationsOptionsMock.some(
      (location) => location.name === newLocationName,
    );

    if (isDuplicate) {
      alert('This location already exists. Please enter a different location.');
      return;
    }

    const newLocation = {
      ...locationsOptionsMock[index],
      name: formData.get('location') as string,
    };
    const newLocations = [...locationsOptionsMock];
    newLocations[index] = newLocation;
    setLocationsOptionsMock(newLocations);
  };
  return (
    <div
      className={`bg-main-white px-6  'border-2 border-transparent`}
      key={index}
    >
      <div className="py-3">
        {!location.name ? (
          <SiteLocationsForm
            form={locationForm}
            onSubmit={handleSubmitLocation}
            onCancel={handleCancelLocation}
            placeholder="New location..."
            name="location"
            index={index}
            inputRef={inputRef}
          />
        ) : (
          <div className="flex flex-row w-full justify-between items-center gap-2">
            <Text className="w-full" variant="small" color="foreground">
              {location.name}
            </Text>
            <Button
              size={'small'}
              variant={'outline'}
              type="button"
              onClick={(e) => handleCancelLocation(e, index)}
            >
              <LucideX />
            </Button>
            <Button
              onClick={(e) => e.stopPropagation()}
              size={'small'}
              variant={'outline'}
            >
              <LucideEllipsis />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
