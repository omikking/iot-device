'use client';

import { Badge, Button, DataTable } from '@gsp/ui';
import { LucideEllipsis, LucideEyeOff, LucideView } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { techniciansMock, TechniciansSchema } from '@/app/mock/mock';

export const TechniciansTable = () => {
  const columns: ColumnDef<TechniciansSchema>[] = [
    {
      accessorKey: 'fullName',
      header: 'Full name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      meta: {
        headerClassName: 'w-80',
      },
    },
    {
      accessorKey: 'company',
      header: 'Company',
      meta: {
        headerClassName: 'w-44',
      },
    },
    {
      accessorKey: 'isGlobal',
      header: 'Visible globally',
      cell: ({ row }) => (
        <>
          {row.getValue('isGlobal') && (
            <Badge variant="success">
              <LucideView />
              Visible
            </Badge>
          )}
          {!row.getValue('isGlobal') && (
            <Badge variant="neutral">
              <LucideEyeOff />
              Private
            </Badge>
          )}
        </>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone number',
    },
    {
      accessorKey: 'settings',
      header: '',
      cell: () => {
        // @TODO get row in cell, send row getValue id data to open delete/edit modals
        return (
          <Button variant="outline" size="small">
            <LucideEllipsis />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={techniciansMock}
        noResultMessage="There are no technicians added yet."
      />
      <Badge variant="neutral" className="self-start">
        {techniciansMock.length} total
      </Badge>
    </>
  );
};
