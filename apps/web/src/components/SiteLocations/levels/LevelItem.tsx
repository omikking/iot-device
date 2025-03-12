'use client';
import {
  IDriveMock,
  ILevelMock,
  ILocationMock,
} from '@/app/(routes)/sitelocations/page';
import React, { useState } from 'react';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { Text } from '@gsp/ui';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { siteLocationsSchema } from '@/components/SiteLocations/SiteLocationsForm';
import { SiteLocationsValue } from '@/components/SiteLocations/SiteLocationsForm';
interface LevelComponentProps {
  selectedLevel?: string;
  level: ILevelMock;
  levelsOptionsMock: ILevelMock[];
  index: number;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSetLevel: (name: string) => void;
  setLevelsOptionsMock: React.Dispatch<React.SetStateAction<ILevelMock[]>>;
  setDrivesOptionsMock: React.Dispatch<React.SetStateAction<IDriveMock[]>>;
  setLocationsOptionsMock: React.Dispatch<
    React.SetStateAction<ILocationMock[]>
  >;
}

export const LevelItem = ({
  selectedLevel,
  level,
  levelsOptionsMock,
  index,
  inputRef,
  handleSetLevel,
  setLevelsOptionsMock,
  setDrivesOptionsMock,
  setLocationsOptionsMock,
}: LevelComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const levelForm: UseFormReturn<SiteLocationsValue> =
    useForm<SiteLocationsValue>({
      resolver: zodResolver(siteLocationsSchema),
      defaultValues: {
        id: '',
        name: '',
      },
    });

  const handleEditLevel = () => {
    setIsEditing(true);
    levelForm.setValue('name', level.name);
  };

  const handleEditSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    const formData = new FormData(e.currentTarget);
    const newLevelName = formData.get('level') as string;

    const isDuplicate = levelsOptionsMock.some(
      (level) => level.name === newLevelName,
    );

    if (isDuplicate) {
      alert('This level already exists. Please enter a different level.');
      return;
    }

    const newLevels = [...levelsOptionsMock];
    newLevels[index] = {
      ...newLevels[index],
      name: newLevelName,
    };
    setLevelsOptionsMock(newLevels);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    levelForm.reset();
  };

  const handleCancelLevel = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const newLevels = [...levelsOptionsMock];
    newLevels[index].drives = [];
    newLevels.splice(index, 1);

    setLevelsOptionsMock(newLevels);
    setDrivesOptionsMock([]);
    setLocationsOptionsMock([]);
  };

  return (
    <div
      className={`bg-main-white px-6 ${selectedLevel === level.name ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div
        className="py-3"
        onClick={() => !isEditing && handleSetLevel(level.name)}
      >
        {!level.name || isEditing ? (
          <SiteLocationsForm
            form={levelForm}
            onSubmit={handleEditSubmit}
            onCancel={handleCancelEdit}
            placeholder="New level..."
            name="level"
            index={index}
            inputRef={inputRef}
          />
        ) : (
          <div
            className="flex flex-row w-full justify-between items-center gap-2"
            key={index}
          >
            <Text className="w-full" variant="small" color="foreground">
              {level.name}
            </Text>

            <DeleteEditDropdown
              itemSelected={index}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              handleEdit={handleEditLevel}
            />
            <DeleteModalConfirmation
              modalTitle="Delete level"
              deleteButtonText="Confirm deletion"
              deleteIcon="Site"
              itemToDelete={index}
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              onDelete={(e) => {
                handleCancelLevel(e, index), setIsDeleteModalOpen(false);
              }}
            >
              <Text variant="medium" color={'foreground'}>
                You are about to delete
                <Text variant="medium" color={'foreground'} as="span" isBold>
                  {` ${level.name} `}
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
