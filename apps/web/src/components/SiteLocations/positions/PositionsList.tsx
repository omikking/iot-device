import React, { useEffect, useRef } from 'react';
import { PositionItem } from './PositionItem';
import { Button, Headline, Text } from '@gsp/ui';
import { IDriveMock, IPositionMock } from '@/app/(routes)/sitelocations/page';
import { LucidePlus } from 'lucide-react';

interface PositionsListComponentProps {
  selectedDrive?: string;
  positionsOptionsMock: IPositionMock[];
  drivesOptionsMock: IDriveMock[];
  setPositionsOptionsMock: React.Dispatch<
    React.SetStateAction<IPositionMock[]>
  >;
}

export const PositionsList = ({
  selectedDrive,
  positionsOptionsMock,
  drivesOptionsMock,
  setPositionsOptionsMock,
}: PositionsListComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addPosition = () => {
    positionsOptionsMock.push({
      id: `${positionsOptionsMock.length + 1}`,
      name: '',
    });
    setPositionsOptionsMock([...positionsOptionsMock] as IPositionMock[]);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [positionsOptionsMock]);

  return (
    <>
      <div className="flex flex-row w-full p-6">
        <Headline as="h2" variant="small" color="foreground" isBold>
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
          <PositionItem
            key={index}
            position={position}
            positionsOptionsMock={positionsOptionsMock}
            index={index}
            setPositionsOptionsMock={setPositionsOptionsMock}
            inputRef={inputRef}
          />
        ))}
      </div>
      <div className="flex justify-end w-full p-3">
        {selectedDrive ? (
          <Button
            size={'small'}
            variant={'primary'}
            onClick={() => addPosition()}
            disabled={
              drivesOptionsMock.length === 0 ||
              positionsOptionsMock.some((position) => position.name === '')
            }
          >
            <LucidePlus /> Add position
          </Button>
        ) : (
          <Button size={'small'} variant={'primary'} disabled>
            <LucidePlus /> Add position
          </Button>
        )}
      </div>
    </>
  );
};
