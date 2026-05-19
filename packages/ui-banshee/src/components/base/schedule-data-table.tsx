'use client';

import { useState } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { TableBody, TableCell, TableRow } from './table';
import {
  ScheduleTable,
  ScheduleTableCell,
  ScheduleTableHead,
  ScheduleTableHeader,
  ScheduleTableRow,
} from './schedule-table';
import { Text } from './text';

export type { ColumnDef };

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  noResultMessage?: string;
  variant?: 'border' | 'noBorder';
  icon?: React.ReactNode;
  className?: string;
}

export function ScheduleDataTable<TData, TValue>({
  columns,
  data,
  noResultMessage = 'Could not find any data.',
  variant,
  icon,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <ScheduleTable variant={variant} className={className}>
      <ScheduleTableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <ScheduleTableHead
                  key={header.id}
                  className={header.column.columnDef.meta?.headerClassName}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </ScheduleTableHead>
              );
            })}
          </TableRow>
        ))}
      </ScheduleTableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <ScheduleTableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => {
                const value = cell.getValue();
                const isNA = value === 'N/A';
                return (
                  <ScheduleTableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.cellClassName}
                  >
                    {isNA ? (
                      <Text variant="small" color="muted" as="span">
                        {value}
                      </Text>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </ScheduleTableCell>
                );
              })}
            </ScheduleTableRow>
          ))
        ) : (
          <ScheduleTableRow>
            <TableCell colSpan={columns.length}>
              <div className="ui-banshee-flex ui-banshee-h-80 ui-banshee-flex-col ui-banshee-justify-center ui-banshee-items-center ui-banshee-gap-5">
                <Text color="foreground" variant="medium">
                  {noResultMessage}
                </Text>
                {icon}
              </div>
            </TableCell>
            <TableCell className="!ui-banshee-p-0" />
          </ScheduleTableRow>
        )}
      </TableBody>
    </ScheduleTable>
  );
}
