'use client';
import { LucideKey, LucidePickaxe, LucideUser } from 'lucide-react';
import { Badge, DataTable, Text } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { Application, UserSchema, usersMock } from '@/app/mock/mock';
import { useState } from 'react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';

// @TODO create a utils folder and add these kind of functions there
export const formatAppName = (appName: string): string => {
  const appNames: Record<string, string> = {
    PULL_TEST: 'Pull Test',
    ULTRABOLTS: 'Ultrabolts',
    XCYCLOPS: 'xCyclops',
    PULL_TEST_OPERATOR: 'Pull Test Operator',
  };

  return appNames[appName] || appName;
};

interface UsersTableProps {
  onOpenChange: (open: boolean) => void;
  onSelectUser: (user: UserSchema) => void;
}

export const UsersTable = ({ onOpenChange, onSelectUser }: UsersTableProps) => {
  const [users, setUsers] = useState(usersMock);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | undefined>(
    undefined,
  );

  const getBadge = (
    role: UserSchema['userPermissions']['role'],
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

  const getAppShortening = (appAccessValue: Application[]) => {
    // @TODO hardcoded application count 4, we should get a dynamic number later to avoid bug
    if (appAccessValue.length === 4) {
      return <Badge variant="primary">All Apps</Badge>;
    }

    const appName = appAccessValue
      .map((app: string) => formatAppName(app) || app)
      .join(', ');

    return appName;
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

  const openEditModal = (index: number) => {
    const userToEdit = users[index];
    onSelectUser(userToEdit);
    onOpenChange(true);
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
      id: 'appAccess',
      header: 'App access',
      accessorFn: (row) => row.userPermissions.appAccess,
      cell: ({ row }) => {
        const appAccessValue = row.getValue('appAccess') as Application[];
        return getAppShortening(appAccessValue);
      },
    },
    {
      accessorKey: 'userPermissions.role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.userPermissions.role;
        const { variant, icon } = getBadge(role);

        return (
          <Badge variant={variant}>
            {icon}
            {role}
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
          <DeleteEditDropdown
            itemSelected={rowIndex}
            openDeleteModal={openDeleteModal}
            handleEdit={openEditModal}
          />
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
            {userToDelete && ` ${users[userToDelete].fullName} `}
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
