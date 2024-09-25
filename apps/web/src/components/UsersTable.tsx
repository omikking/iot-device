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
  const getRoleBadge = (role: 'User' | 'Technician' | 'Admin') => {
    const badges = {
      User: {
        variant: 'neutral',
        icon: <LucideUser />,
      },
      Technician: {
        variant: 'neutral',
        icon: <LucidePickaxe />,
      },
      Admin: {
        variant: 'primary',
        icon: <LucideKey />,
      },
    };
    return badges[role];
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
        // Pick<BadgeProps, 'variant'>
        // Fix props for variant, dont know why its not working
        return (
          <Badge variant={getRoleBadge(row.getValue('role')).variant as any}>
            {getRoleBadge(row.getValue('role')).icon}
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
        // send row getValue id data to open delete/edit modals
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
      <DataTable columns={columns} data={usersMock} />
      <Badge variant="neutral" className="self-start">
        {usersMock.length} total
      </Badge>
    </>
  );
};
