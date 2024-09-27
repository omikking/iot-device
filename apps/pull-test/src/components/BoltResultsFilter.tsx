'use client';

import {
  Badge,
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@gsp/ui';
import {
  LucideCircleCheckBig,
  LucideOctagonAlert,
  LucideSearchX,
  LucideSlidersHorizontal,
  LucideX,
} from 'lucide-react';

// @TODO: Add filtering functionality, this is essentially a visual mockup currently.
interface BoltResultsFilterProps {
  selectedTab?: string;
}
export const BoltResultsFilter = ({ selectedTab }: BoltResultsFilterProps) => {
  return (
    <Popover>
      {selectedTab === 'table' && (
        <PopoverTrigger asChild>
          <Button variant="primary" size="large" className="mt-8">
            <LucideSlidersHorizontal />
            Filter
          </Button>
        </PopoverTrigger>
      )}
      <PopoverContent align="start" className="mt-1.5">
        <div className="space-y-2 bg-neutral-1 px-4 py-3">
          <Text variant="small" color="foreground">
            Results
          </Text>
        </div>
        <div className="flex flex-row px-4 py-3 gap-3 items-center m">
          <Checkbox />
          <Badge variant="success">
            <LucideCircleCheckBig />
            Pass
          </Badge>
        </div>
        <div className="flex flex-row px-4 py-3 gap-3 items-center m">
          <Checkbox />
          <Badge variant="destructive">
            <LucideOctagonAlert />
            Fail
          </Badge>
        </div>
        <div className="flex flex-row px-4 py-3 gap-3 items-center m">
          <Checkbox />
          <Badge variant="warning">
            <LucideSearchX />
            Abort
          </Badge>
        </div>

        <div className="space-y-2 bg-neutral-1 px-4 py-3">
          <Text variant="small" color="foreground">
            Comment
          </Text>
        </div>
        <div className="flex flex-col gap-6 p-4">
          <div className="flex flex-row items-center gap-3">
            <Checkbox />
            <Text variant="small" color="foreground">
              With comment
            </Text>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Checkbox />
            <Text variant="small" color="foreground">
              With image
            </Text>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Checkbox />
            <Text variant="small" color="foreground">
              Reported hazard
            </Text>
          </div>
        </div>

        <div className="p-4 border-t border-t-1 border-neutral-1">
          <Button variant="outline" size="small" isWide>
            <LucideX />
            Reset all filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
