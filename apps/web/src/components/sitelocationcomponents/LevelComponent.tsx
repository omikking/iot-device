import React from 'react';
import SiteLocationsForm from '../SiteLocationsForm';
import { Button, Text } from '@gsp/ui';
import { LucideX, LucideEllipsis } from 'lucide-react';

interface LevelComponentProps {
  level: any;
  index: number;
  selectedLevel: string;
  handleSetLevel: (name: string) => void;
  setSelectedLevel: (id: string) => void;
  levelForm: any;
  handleSubmitLevel: (
    event: React.FormEvent<HTMLFormElement>,
    index: number,
  ) => void;
  handleCancelLevel: (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => void;
}

export const LevelComponent: React.FC<LevelComponentProps> = ({
  level,
  index,
  selectedLevel,
  handleSetLevel,
  setSelectedLevel,
  levelForm,
  handleSubmitLevel,
  handleCancelLevel,
}) => {
  return (
    <div
      className={`bg-main-white px-6 ${selectedLevel === level.id ? 'border-2 border-blue-primary ' : 'border-2 border-transparent'}`}
      key={index}
    >
      <div
        className="py-3"
        onClick={() => (handleSetLevel(level.name), setSelectedLevel(level.id))}
      >
        {level.name === '' ? (
          <div>
            <SiteLocationsForm
              form={levelForm}
              onSubmit={handleSubmitLevel}
              onCancel={handleCancelLevel}
              placeholder="New level..."
              name="level"
              index={index}
            />
          </div>
        ) : (
          <div className="flex flex-row w-full justify-between items-center gap-2">
            <Text className="w-full" variant="small" color="foreground">
              {level.name}
            </Text>
            <Button
              size={'small'}
              variant={'outline'}
              type="button"
              onClick={(e) => handleCancelLevel(e, index)}
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

// export default LevelComponent;
