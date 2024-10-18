import React from 'react';
import SiteLocationsForm from '../SiteLocationsForm';
import { Button, Text } from '@gsp/ui';
import { LucideEllipsis, LucideX } from 'lucide-react';

interface PositionComponentProps {
  position: any;
  index: number;
  selectedPosition: string;
  handleSetPosition: (name: string) => void;
  setSelectedPosition: (id: string) => void;
  positionForm: any;
  handleSubmitPosition: (
    event: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => void;
  handleCancelPosition: (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => void;
}

export const PositionComponent: React.FC<PositionComponentProps> = ({
  position,
  index,
  selectedPosition,
  handleSetPosition,
  setSelectedPosition,
  positionForm,
  handleSubmitPosition,
  handleCancelPosition,
}) => {
  return (
    <div
      className={`bg-main-white px-6 ${selectedPosition === position.id ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div
        className="py-3"
        onClick={() => (
          handleSetPosition(position.name), setSelectedPosition(position.id)
        )}
      >
        {position.name === '' ? (
          <div>
            <SiteLocationsForm
              form={positionForm}
              onSubmit={handleSubmitPosition}
              onCancel={handleCancelPosition}
              placeholder="New position..."
              name="position"
              index={index}
            />
          </div>
        ) : (
          <div className="flex flex-row w-full justify-between items-center gap-2">
            <Text className="w-full" variant="small" color="foreground">
              {position.name}
            </Text>
            {/* TODO: will remove this button later. Just here for testing purposes
                          remove button will be inside the ellipsis button
                */}
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
