import React, { useEffect, useRef } from 'react';
import { PositionComponent } from './PositionComponent';
import { Headline, Text } from '@gsp/ui';
import { SitesLocationFormData } from '@/app/(routes)/siteslocations/page';
import { UseFormReturn } from 'react-hook-form';

interface PositionsOptionsMock {
  id: string;
  name: string;
}

interface PositionsListComponentProps {
  positionsOptionsMock: PositionsOptionsMock[];
  selectedPosition: string;

  setSelectedPosition: (id: string) => void;
  positionForm: UseFormReturn<SitesLocationFormData>;
  handleSubmitPosition: (
    event: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => void;
  handleCancelPosition: (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => void;
}

export const PositionsListComponent: React.FC<PositionsListComponentProps> = ({
  positionsOptionsMock,
  selectedPosition,

  setSelectedPosition,
  positionForm,
  handleSubmitPosition,
  handleCancelPosition,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [positionsOptionsMock]);
  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="smallBold" color="foreground">
          Positions
        </Headline>
      </div>
      <div className="flex flex-col gap-1 w-full h-full border-y py-6 px-6 overflow-auto">
        {positionsOptionsMock?.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <Text variant="small" color="foreground">
              Select site to view available positions
            </Text>
          </div>
        )}
        {positionsOptionsMock?.map((position, index) => (
          <PositionComponent
            key={index}
            position={position}
            index={index}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
            positionForm={positionForm}
            handleSubmitPosition={handleSubmitPosition}
            handleCancelPosition={handleCancelPosition}
            inputRef={inputRef}
          />
        ))}
      </div>
    </>
  );
};
