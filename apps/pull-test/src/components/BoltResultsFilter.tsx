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
  LucideXCircle,
  LucideCircleCheckBig,
  LucideSearchX,
  LucideSlidersHorizontal,
  LucideX,
} from 'lucide-react';
import { useState } from 'react';

export type FilterState = {
  pass: boolean;
  fail: boolean;
  abort: boolean;
  withComment: boolean;
  withImage: boolean;
  reportedHazard: boolean;
};
interface BoltResultsFilterProps {
  selectedTab?: string;
  onFilterChange: (filters: FilterState) => void;
}

// @TODO: Add filtering functionality, this is essentially a visual mockup currently.
export const BoltResultsFilter = ({
  selectedTab,
  onFilterChange,
}: BoltResultsFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    pass: false,
    fail: false,
    abort: false,
    withComment: false,
    withImage: false,
    reportedHazard: false,
  });

  const handleFilterChange = (key: keyof FilterState) => {
    const newFilters = {
      ...filters,
      [key]: !filters[key],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetState = {
      pass: false,
      fail: false,
      abort: false,
      withComment: false,
      withImage: false,
      reportedHazard: false,
    };
    setFilters(resetState);
    onFilterChange(resetState);
  };

  return (
    <Popover>
      {selectedTab === 'table' && (
        <PopoverTrigger asChild>
          <Button variant="primary" size="large" className="mt-8">
            <LucideSlidersHorizontal />
            Filter
            {Object.values(filters).some(Boolean) && (
              <Badge variant="neutral" className="ml-2">
                {Object.values(filters).filter(Boolean).length}
              </Badge>
            )}
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
          <Checkbox
            checked={filters.pass}
            onCheckedChange={() => handleFilterChange('pass')}
          />
          <Badge variant="success">
            <LucideCircleCheckBig />
            Pass
          </Badge>
        </div>
        <div className="flex flex-row px-4 py-3 gap-3 items-center m">
          <Checkbox
            checked={filters.fail}
            onCheckedChange={() => handleFilterChange('fail')}
          />

          <Badge variant="destructive">
            <LucideXCircle />
            Fail
          </Badge>
        </div>
        <div className="flex flex-row px-4 py-3 gap-3 items-center m">
          <Checkbox
            checked={filters.abort}
            onCheckedChange={() => handleFilterChange('abort')}
          />
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
            <Checkbox
              checked={filters.withComment}
              onCheckedChange={() => handleFilterChange('withComment')}
            />
            <Text variant="small" color="foreground">
              With comment
            </Text>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Checkbox
              checked={filters.withImage}
              onCheckedChange={() => handleFilterChange('withImage')}
            />
            <Text variant="small" color="foreground">
              With image
            </Text>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Checkbox
              checked={filters.reportedHazard}
              onCheckedChange={() => handleFilterChange('reportedHazard')}
            />
            <Text variant="small" color="foreground">
              Reported hazard
            </Text>
          </div>
        </div>

        <div className="p-4 border-t border-t-1 border-neutral-1">
          <Button variant="outline" size="small" onClick={resetFilters} isWide>
            <LucideX />
            Reset all filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
