import React from 'react';
import SiteLocationsForm from '../SiteLocationsForm';
import { Button, Text } from '@gsp/ui';
import { LucideEllipsis, LucideX } from 'lucide-react';

interface PositionsOptionsMock {
  id: string;
  name: string;
}

interface PositionComponentProps {
  position: PositionsOptionsMock;
  index: number;
  selectedPosition: string;
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
  inputRef: React.RefObject<HTMLInputElement>;
}

export const PositionComponent: React.FC<PositionComponentProps> = ({
  position,
  index,
  selectedPosition,

  setSelectedPosition,
  positionForm,
  handleSubmitPosition,
  handleCancelPosition,
  inputRef,
}) => {
  return (
    <div
      className={`bg-main-white px-6 ${selectedPosition === position.id ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div className="py-3" onClick={() => setSelectedPosition(position.id)}>
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
