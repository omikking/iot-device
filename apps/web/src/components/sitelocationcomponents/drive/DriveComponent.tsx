import React from 'react';
import SiteLocationsForm from '../SiteLocationsForm';
import { Button, Text } from '@gsp/ui';
import { LucideEllipsis, LucideX } from 'lucide-react';

interface DriveOptionsMock {
  id: string;
  name: string;
}

interface DriveComponentProps {
  drive: DriveOptionsMock;
  index: number;
  selectedDrive: string;
  handleSetDrive: (name: string) => void;
  setSelectedDrive: (id: string) => void;
  driveForm: any;
  handleSubmitDrive: (
    event: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => void;
  handleCancelDrive: (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => void;
}

export const DriveComponent: React.FC<DriveComponentProps> = ({
  drive,
  index,
  selectedDrive,
  handleSetDrive,
  setSelectedDrive,
  driveForm,
  handleSubmitDrive,
  handleCancelDrive,
}) => {
  return (
    <div
      className={`bg-main-white px-6 ${selectedDrive === drive.id ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div
        className="py-3"
        onClick={() => (handleSetDrive(drive.name), setSelectedDrive(drive.id))}
      >
        {drive.name === '' ? (
          <div>
            <SiteLocationsForm
              form={driveForm}
              onSubmit={handleSubmitDrive}
              onCancel={handleCancelDrive}
              placeholder="New drive..."
              name="drive"
              index={index}
            />
          </div>
        ) : (
          <div className="flex flex-row w-full justify-between items-center gap-2">
            <Text className="w-full" variant="small" color="foreground">
              {drive.name}
            </Text>
            <Button
              size={'small'}
              variant={'outline'}
              type="button"
              onClick={(e) => handleCancelDrive(e, index)}
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
