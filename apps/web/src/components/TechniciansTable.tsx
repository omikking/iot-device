'use client';

import { Badge, Button, DataTable } from '@gsp/ui';
import { LucideEllipsis, LucideEyeOff, LucideView } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

interface TechniciansSchema {
  id: string;
  fullName: string;
  email: string;
  company: string;
  isGlobal: boolean;
  phoneNumber: string;
}

export const TechniciansTable = () => {
  const techniciansMock: TechniciansSchema[] = [
    {
      id: '1',
      fullName: 'Elliot Alderson',
      email: 'elliotalderson@sandvik.com',
      company: 'Sandvik',
      isGlobal: true,
      phoneNumber: '+4683729327',
    },
    {
      id: '2',
      fullName: 'Jimmy Nwadinkpa',
      email: 'jimmy@sandvik.com',
      company: 'Sandvik',
      isGlobal: false,
      phoneNumber: '+4683729327',
    },
    {
      id: '3',
      fullName: 'Felix Östergren',
      email: 'felix@sandvik.com',
      company: 'Sandvik',
      isGlobal: false,
      phoneNumber: '+4683729327',
    },
    {
      id: '4',
      fullName: 'Whiterose',
      email: 'whiterose@sandvik.com',
      company: 'Sandvik',
      isGlobal: true,
      phoneNumber: '+4683729327',
    },
    {
      id: '5',
      fullName: 'Darlene Alderson',
      email: 'darlenealderson@sandvik.com',
      company: 'Sandvik',
      isGlobal: false,
      phoneNumber: '+4683729327',
    },
    {
      id: '6',
      fullName: 'Tyrell Wellick',
      email: 'tyrellwellick@sandvik.com',
      company: 'Sandvik',
      isGlobal: true,
      phoneNumber: '+4683729327',
    },
  ];

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
      <DataTable columns={columns} data={techniciansMock} />
      <Badge variant="neutral" className="self-start">
        {techniciansMock.length} total
      </Badge>
    </>
  );
};
