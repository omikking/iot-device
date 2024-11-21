'use client';
import { LucideKey, LucidePickaxe, LucideUser } from 'lucide-react';
import { Badge, DataTable, Text } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { UserSchema, usersMock } from '@/app/mock/mock';
import { useState } from 'react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';

export const UsersTable = () => {
  const [users, setUsers] = useState(usersMock);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | undefined>(
    undefined,
  );

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

  const openDeleteModal = (index: number) => {
    setUserToDelete(index);
    setIsDeleteUserModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteUserModalOpen(false);
    setUserToDelete(undefined);
  };

  const handleDelete = (index: number) => {
    setUsers((currentUsers) => currentUsers.filter((item, i) => i !== index));
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
      cell: ({ row }) => {
        const rowIndex = users.findIndex((user) => user.id === row.original.id);

        return (
          <>
            <DeleteEditDropdown
              itemToDelete={rowIndex}
              openDeleteModal={openDeleteModal}
              handleEdit={() => console.log('Edit')}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <DeleteModalConfirmation
        deleteButtonText="Confirm deletion"
        deleteIcon="User"
        modalTitle="Delete user"
        isOpen={isDeleteUserModalOpen}
        itemToDelete={userToDelete}
        onOpenChange={closeDeleteModal}
        onDelete={(event, index) => {
          handleDelete(index);
          closeDeleteModal();
        }}
      >
        <Text variant="medium" color={'foreground'}>
          You are about to delete
          <Text variant="medium" color={'foreground'} isBold as="span">
            {userToDelete !== undefined && ` ${users[userToDelete].fullName} `}
          </Text>
          from the list. Are you sure you want to delete?
        </Text>
      </DeleteModalConfirmation>

      <DataTable
        columns={columns}
        data={users}
        noResultMessage="There are no users added yet."
      />
      {users.length && (
        <Badge variant="neutral" className="self-start">
          {users.length} total
        </Badge>
      )}
    </>
  );
};
