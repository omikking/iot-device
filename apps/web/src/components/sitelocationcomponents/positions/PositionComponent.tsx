import React from 'react';
import { SiteLocationsForm } from '../SiteLocationsForm';
import { Button, Text } from '@gsp/ui';
import { LucideEllipsis, LucideX } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IPositionMock } from '@/app/(routes)/siteslocations/page';

interface PositionComponentProps {
  position: IPositionMock;
  index: number;
  positionsOptionsMock: IPositionMock[];
  inputRef: React.RefObject<HTMLInputElement>;
  setPositionsOptionsMock: React.Dispatch<
    React.SetStateAction<IPositionMock[]>
  >;
}

export const PositionComponent = ({
  position,
  positionsOptionsMock,
  index,
  setPositionsOptionsMock,
  inputRef,
}: PositionComponentProps) => {
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

  const handleCancelPosition = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.preventDefault();

    const newPositions = [...positionsOptionsMock];
    newPositions.splice(index, 1);
    setPositionsOptionsMock(newPositions);
  };

  const handleSubmitPosition = (
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
      alert('This position already exists. Please enter a different position.');
      return;
    }

    const newPosition = {
      ...positionsOptionsMock[index],
      name: formData.get('position') as string,
    };
    const newPositions = [...positionsOptionsMock];
    newPositions[index] = newPosition;
    setPositionsOptionsMock(newPositions);
  };

  return (
    <div className="bg-main-white px-6" key={index}>
      <div className="py-3">
        {position.name === '' ? (
          <div>
            <SiteLocationsForm
              form={positionForm}
              onSubmit={handleSubmitPosition}
              onCancel={handleCancelPosition}
              placeholder="New position..."
              name="position"
              index={index}
              inputRef={inputRef}
            />
          </div>
        ) : (
          <div className="flex flex-row w-full justify-between items-center gap-2">
            <Text className="w-full" variant="small" color="foreground">
              {position.name}
            </Text>
            <Button
              size={'small'}
              variant={'outline'}
              type="button"
              onClick={(e) => handleCancelPosition(e, index)}
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
