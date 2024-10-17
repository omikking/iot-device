'use client';

import { Badge, Button, DataTable } from '@gsp/ui';
import {
  LucideEllipsis,
  LucideKey,
  LucidePickaxe,
  LucideUser,
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { UserSchema, usersMock } from '@/app/mock/mock';

export const UsersTable = () => {
  const getBadge = (
    role: 'User' | 'Technician' | 'Admin',
  ): {
    variant: 'neutral' | 'primary';
    icon: React.ReactNode;
  } => {
    switch (role) {
      case 'User':
        return { variant: 'neutral', icon: <LucideUser /> };
      case 'Technician':
        return { variant: 'neutral', icon: <LucidePickaxe /> };
      case 'Admin':
        return { variant: 'primary', icon: <LucideKey /> };
    }
  };

  const columns: ColumnDef<UserSchema>[] = [
    {
      accessorKey: 'fullName',
      header: 'Full name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'appAccess',
      header: 'App access',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        return (
          <Badge variant={getBadge(row.getValue('role')).variant}>
            {getBadge(row.getValue('role')).icon}
            {row.getValue('role')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone number',
    },
    {
      accessorKey: 'settings',
      header: '',
      cell: () => {
        // @TODO send row getValue id data to open delete/edit modals
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
        data={usersMock}
        noResultMessage="There are no users added yet."
      />
      {usersMock.length && (
        <Badge variant="neutral" className="self-start">
          {usersMock.length} total
        </Badge>
      )}
    </>
  );
};
