'use client';
import { LucideKey, LucidePickaxe, LucideUser } from 'lucide-react';
import { Badge, DataTable, Text } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
// import { UserSchema } from '@/app/mock/mock';
import { useState } from 'react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { useUsers } from '@/components/urql-users/UsersClientUrql';
import { UsersDeleteUrql } from '@/components/urql-users/UsersDeleteUrql';

type UsersTableProps = {
  onOpenChange: (open: boolean) => void;
  onSelectUser: (user: IUser) => void;
};

type IUser = {
  id: string;
  email: string;
  fullName: string;
  workPlace: string;
  phoneNumber: string;
  globalRole: boolean;
  isGlobalVisibility: boolean;
  userPermissions: UserPermission[];
};

type UserPermission = {
  id: string;
  userId: string;
  role: 'User' | 'Technician' | 'Admin' | 'SANDVIK_ADMIN';
  appsAccess: string[];
};

// type IUsers = {
//   users: IUser[];
// };

export const UsersTable = ({ onOpenChange, onSelectUser }: UsersTableProps) => {
  const { users } = useUsers();
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | undefined>(
    undefined,
  );
  const { deleteUser } = UsersDeleteUrql();

  const appAccessShortNames: Record<string, string> = {
    PULL_TEST: 'PT',
    ULTRABOLTS: 'UB',
    XCYCLOPS: 'xLops',
    PULL_TEST_OPERATOR: 'PT-O',
  };

  // Check if userPermissions is an array otherwise return a single object
  const getUserPermissions = (
    permissions: UserPermission[],
  ): UserPermission => {
    const defaultPermission: UserPermission = {
      id: '',
      userId: '',
      role: 'User',
      appsAccess: [],
    };

    return permissions[0] || defaultPermission;
  };

  const getBadge = (
    role: UserPermission['role'],
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
      case 'SANDVIK_ADMIN':
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

  const handleDelete = async (index: number) => {
    // deleteUser(users[index].id);
    await deleteUser(users[index].id);
  };

  const openEditModal = (index: number) => {
    const userToEdit = users[index];
    onSelectUser(userToEdit);
    onOpenChange(true);
  };

  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: 'fullName',
      header: 'Full name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      id: 'appsAccess',
      header: 'App access',
      // accessorFn: (row) => row.userPermissions.appsAccess,
      accessorFn: (row) => row.userPermissions,
      cell: ({ row }) => {
        const userPerm = getUserPermissions(row.original.userPermissions);
        const appAccessValue = userPerm?.appsAccess || [];
        // const appAccessValue = (row.getValue('appsAccess') as string[]) || [];

        if (appAccessValue.length === 1) {
          return appAccessValue[0]; // Show full name
        }

        if (appAccessValue.length === 4) {
          return 'All Apps';
        }

        // Split the appAccessValue and map with defined types
        const shortenedApps = appAccessValue
          .map((app: string) => appAccessShortNames[app] || app)
          .join(', ');

        return shortenedApps;
      },
    },
    {
      accessorKey: 'userPermissions.role',
      header: 'Role',
      cell: ({ row }) => {
        const userPermissionRole = getUserPermissions(
          row.original.userPermissions,
        ).role;
        const { variant, icon } = getBadge(userPermissionRole);

        return (
          <Badge variant={variant}>
            {icon}
            {userPermissionRole}
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
              itemSelected={rowIndex}
              openDeleteModal={openDeleteModal}
              handleEdit={openEditModal}
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
        // onDelete={() => {
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
