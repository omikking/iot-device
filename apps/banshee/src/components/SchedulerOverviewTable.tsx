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
} from '@gsp/ui-banshee';
import { useState, useMemo, ComponentProps } from 'react';
import { getStatusColorHex, getStatusLabel } from '@/libs/status-color-utils';
import { SchedulerEntry } from '@/app/mock/mock';

type ColumnProp = ComponentProps<typeof TableHeadWithSorting>['column'];
type SortConfig = {
  key: keyof SchedulerEntry;
  direction: 'asc' | 'desc';
} | null;

export const SchedulerOverviewTable = ({
  entries,
}: {
  entries: SchedulerEntry[];
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const sortedEntries = useMemo(() => {
    const sortable = [...entries];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'dueDate') {
          aValue = new Date(aValue).getTime().toString();
          bValue = new Date(bValue).getTime().toString();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
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

  return (
    <div className="ui-banshee-col-span-1 lg:ui-banshee-col-span-2 ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full  ui-banshee-h-full">
      <Headline variant="small" color="foreground" as="h3" isBold className='ui-banshee-mb-2'>
        Scheduler Overview
      </Headline>
      <div className="ui-banshee-flex ui-banshee-h-[45vh]">
        <div className="ui-banshee-bg-neutral-1 ui-banshee-overflow-y-auto ui-banshee-overflow-x-auto ui-banshee-min-h-0 ui-banshee-w-full">
          <Table variant="noBorder" className="ui-banshee-min-w-[400px]">
            <TableHeader>
              <TableRow>
                <TableHead className="ui-banshee-w-8 ui-banshee-text-left">
                  <Text
                    variant="small"
                    color="foreground"
                    className="ui-banshee-font-bold"
                  >
                    •
                  </Text>
                </TableHead>
                <TableHead className="ui-banshee-p-0 ui-banshee-w-[40%]">
                  <TableHeadWithSorting
                    header="Banshee"
                    className="ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-start"
                    column={createMockColumn('banshee')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Location"
                    className="ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-start"
                    column={createMockColumn('location')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Due date"
                    className="ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-start"
                    column={createMockColumn('dueDate')}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.map((entry, index) => (
                <TableRow key={`${entry.banshee}-${index}`}>
                  <TableCell>
                    <div
                      className="ui-banshee-w-3 ui-banshee-mx-auto ui-banshee-h-3 ui-banshee-rounded-full"
                      style={{
                        backgroundColor: getStatusColorHex(
                          entry?.status,
                        ),
                      }}
                      title={getStatusLabel(entry?.status)}
                    />
                  </TableCell>
                  <TableCell className='ui-banshee-px-4'>
                    <Text variant="small" color="foreground" className='ui-banshee-text-left'>
                      {entry?.banshee}
                    </Text>
                  </TableCell>
                  <TableCell className='ui-banshee-px-4'>
                    <Text variant="small" color="foreground" className='ui-banshee-text-left'>
                      {entry?.location}
                    </Text>
                  </TableCell>
                  <TableCell className='ui-banshee-px-4'>
                    <Text variant="small" color="foreground" className='ui-banshee-text-left'>
                      {entry?.dueDate}
                    </Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
