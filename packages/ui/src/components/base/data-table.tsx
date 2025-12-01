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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
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

export function DataTable<TData, TValue>({
  columns,
  data,
  noResultMessage = 'Could not find any data.',
  variant,
  icon,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
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
    <Table variant={variant} className={className}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className={header.column.columnDef.meta?.headerClassName}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => {
                const value = cell.getValue();
                const isNA = value === 'N/A';
                return (
                  <TableCell
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
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length}>
              <div className="ui-flex ui-h-80 ui-flex-col ui-justify-center ui-items-center ui-gap-5">
                <Text color="foreground" variant="medium">
                  {noResultMessage}
                </Text>
                {icon}
              </div>
            </TableCell>
            <TableCell className="!ui-p-0" />
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
