'use client';

import {
  Text,
  Headline,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableHeadWithSorting,
  LoadingSpinner,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
} from '@gsp/ui-banshee';
import { useState, useMemo, ComponentProps } from 'react';
import { getStatusColorHex, getStatusLabel } from '@/libs/status-color-utils';
import { compareValues } from '@/libs/sort-compare';

type ColumnProp = ComponentProps<typeof TableHeadWithSorting>['column'];
type SchedulerEntry = {
  status: string;
  statusColor: string;
  banshee: string;
  location: string;
  dueDate: string;
};
type SortConfig = {
  key: keyof SchedulerEntry;
  direction: 'asc' | 'desc';
} | null;

export const SchedulerOverviewTable = ({
  entries,
  fetching = false,
}: {
  entries: SchedulerEntry[];
  fetching?: boolean;
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'dueDate',
    direction: 'asc',
  });
  const sortedEntries = useMemo(() => {
    const sortable = [...entries];
    const parseDate = (date: string) => {
      const [day, month, year] = date.split('/').map(Number);
      return new Date(year, month - 1, day).getTime();
    };
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        if (sortConfig.key === 'dueDate') {
          const aHasDate = a.dueDate !== '-';
          const bHasDate = b.dueDate !== '-';

          // Handle "-" values
          if (!aHasDate && !bHasDate) return 0;

          if (!aHasDate) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }

          if (!bHasDate) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }

          const aTime = parseDate(a.dueDate);
          const bTime = parseDate(b.dueDate);

          return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
        }

        return compareValues(
          a[sortConfig.key],
          b[sortConfig.key],
          sortConfig.direction,
        );
      });
    }
    return sortable;
  }, [entries, sortConfig]);

  const requestSort = (key: keyof SchedulerEntry) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const createMockColumn = (key: keyof SchedulerEntry) =>
    ({
      getIsSorted: () =>
        sortConfig?.key === key ? sortConfig.direction : false,
      toggleSorting: () => requestSort(key),
    }) as ColumnProp;

  if (fetching) {
    return (
      <div className="ui-banshee-col-span-1 lg:ui-banshee-col-span-2 ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full  ui-banshee-h-full">
        <Headline
          variant="small"
          color="foreground"
          as="h3"
          isBold
          className="ui-banshee-mb-2"
        >
          Scheduler overview
        </Headline>
        <div className="ui-banshee-flex ui-banshee-h-[45vh]">
          <div className="ui-banshee-bg-neutral-1 ui-banshee-overflow-y-auto ui-banshee-overflow-x-auto ui-banshee-min-h-0 ui-banshee-w-full">
            <div className="ui-banshee-h-full ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2 ui-banshee-text-neutral-500">
              <LoadingSpinner />
              Loading scheduler overview...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ui-banshee-col-span-1 lg:ui-banshee-col-span-2 ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full  ui-banshee-h-full">
      <Headline
        variant="small"
        color="foreground"
        as="h3"
        isBold
        className="ui-banshee-mb-2"
      >
        Scheduler overview
      </Headline>
      <div className="ui-banshee-flex ui-banshee-h-[45vh]">
        <div className="ui-banshee-bg-neutral-1 ui-banshee-overflow-y-auto ui-banshee-overflow-x-auto ui-banshee-min-h-0 ui-banshee-w-full">
          <TooltipProvider delayDuration={200}>
            <Table variant="noBorder" className="ui-banshee-min-w-[400px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="ui-banshee-w-8 ui-banshee-text-left">
                    <Text
                      variant="small"
                      color="foreground"
                      className="ui-banshee-font-bold"
                    />
                  </TableHead>
                  <TableHead className="ui-banshee-p-0 ui-banshee-w-[40%]">
                    <TableHeadWithSorting
                      header="Banshee"
                      className="ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-start ui-banshee-text-base"
                      column={createMockColumn('banshee')}
                    />
                  </TableHead>
                  <TableHead className="ui-banshee-p-0">
                    <TableHeadWithSorting
                      header="Location"
                      className="ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-start ui-banshee-text-base"
                      column={createMockColumn('location')}
                    />
                  </TableHead>
                  <TableHead className="ui-banshee-p-0">
                    <TableHeadWithSorting
                      header="Due date"
                      className="ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-start ui-banshee-text-base"
                      column={createMockColumn('dueDate')}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEntries.map((entry, index) => (
                  <TableRow key={`${entry.banshee}-${index}`}>
                    <TableCell>
                      <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              tabIndex={0}
                              role="img"
                              aria-label={getStatusLabel(entry?.status)}
                              className="ui-banshee-inline-block ui-banshee-w-3 ui-banshee-h-3 ui-banshee-rounded-full ui-banshee-cursor-pointer"
                              style={{
                                backgroundColor: getStatusColorHex(
                                  entry?.status,
                                ),
                              }}
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            {getStatusLabel(entry?.status)}
                            <TooltipArrow />
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="ui-banshee-px-4">
                      <Text
                        variant="medium"
                        color="foreground"
                        className="ui-banshee-text-left"
                      >
                        {entry?.banshee}
                      </Text>
                    </TableCell>
                    <TableCell className="ui-banshee-px-4">
                      <Text
                        variant="medium"
                        color="foreground"
                        className="ui-banshee-text-left"
                      >
                        {entry?.location}
                      </Text>
                    </TableCell>
                    <TableCell className="ui-banshee-px-4">
                      <Text
                        variant="medium"
                        color="foreground"
                        className="ui-banshee-text-left"
                      >
                        {entry?.dueDate}
                      </Text>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
