import { z } from 'zod';
import React, { useEffect, useState } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from '@gsp/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideEllipsis, LucideSquarePen, LucideTrash2 } from 'lucide-react';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { IPositionMock } from '@/app/(routes)/sitelocations/page';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';

interface PositionComponentProps {
  position: IPositionMock;
  index: number;
  positionsOptionsMock: IPositionMock[];
  inputRef: React.RefObject<HTMLInputElement>;
  setPositionsOptionsMock: React.Dispatch<
    React.SetStateAction<IPositionMock[]>
  >;
}

export const PositionItem = ({
  position,
  index,
  positionsOptionsMock,
  setPositionsOptionsMock,
  inputRef,
}: PositionComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditPosition = () => {
    setIsEditing(true);
    // Pre-fill the form with current drive name
    positionForm.setValue('name', position.name);
  };

  const handleEditSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newPositionName = formData.get('position') as string;
    const isDuplicate = positionsOptionsMock.some(
      (position) => position.name === newPositionName,
    );

    if (isDuplicate) {
      alert('This level already exists. Please enter a different level.');
      return;
    }

    const newLevels = [...positionsOptionsMock];
    newLevels[index] = {
      ...newLevels[index],
      name: newPositionName,
    };
    setPositionsOptionsMock(newLevels);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    positionForm.reset();
  };

  const positionFormSchema = z.object({
    id: z.string(),
    name: z.string(),
  });

  const positionForm = useForm<z.infer<typeof positionFormSchema>>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      id: '',
      name: '',
    },
  });

  const handleCancelPosition = (index: number) => {
    const newPositions = [...positionsOptionsMock];
    newPositions.splice(index, 1);
    setPositionsOptionsMock(newPositions);
  };

  //@TODO fixed problem with site not responding to click when modal has been closed
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
    };
  }, []);

  return (
    <div
      className={`bg-main-white px-6  'border-2 border-transparent`}
      key={index}
    >
      <div className="py-3" onClick={() => !isEditing}>
        {!position.name || isEditing ? (
          <SiteLocationsForm
            form={positionForm}
            onSubmit={handleEditSubmit}
            onCancel={handleCancelEdit}
            placeholder="New position..."
            name="position"
            index={index}
            inputRef={inputRef}
          />
        ) : (
          <div className="flex flex-row w-full justify-between items-center gap-2">
            <Text className="w-full" variant="small" color="foreground">
              {position.name}
            </Text>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={'small'} variant="outline">
                  <LucideEllipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-4">
                <DropdownMenuItem onSelect={() => handleEditPosition()}>
                  <LucideSquarePen />
                  <Text color={'foreground'} variant={'medium'}>
                    Edit
                  </Text>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>
                  <LucideTrash2 className="text-error" />
                  <Text color={'destructive'} variant={'medium'}>
                    Delete
                  </Text>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteModalConfirmation
              modalTitle="Delete drive"
              deleteButtonText="Confirm deletion"
              deleteIcon="Site"
              index={index}
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              onDelete={() => {
                handleCancelPosition(index), setIsDeleteModalOpen(false);
              }}
            >
              <Text variant="medium" color={'foreground'}>
                You are about to delete
                <Text variant="medium" color={'foreground'} as="span">
                  {` ${position.name} `}
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
