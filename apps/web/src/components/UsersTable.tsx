'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Badge, DataTable, Text } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { LucideKey, LucidePickaxe, LucideUser } from 'lucide-react';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { UsersDeleteUrql } from '@/components/urql-users/UsersDeleteUrql';
import { useCompanyUsers } from '@/components/urql-companies/CompanyClientUrql';

type UsersTableProps = {
  onOpenChange: (open: boolean) => void;
  onSelectUser: (user: ICompanyUser) => void;
};

type ICompanyUser = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  userPermissions: UserPermission[];
};

type UserPermission = {
  id: string;
  userId: string;
  role:
    | 'COMPANY_USER'
    | 'COMPANY_ADMIN'
    | 'SANDVIK_TECHNICIAN'
    | 'SANDVIK_ADMIN';
  appsAccess: string[];
};

export const UsersTable = ({ onOpenChange, onSelectUser }: UsersTableProps) => {
  const params = useParams();
  const companyId = params.id as string;
  const { users } = useCompanyUsers(companyId);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | undefined>(
    undefined,
  );
  const { deleteUser } = UsersDeleteUrql();

  //@TODO - move to shared types?
  const appAccessFullNames: Record<string, string> = {
    PULL_TEST: 'Pull-Test',
    ULTRABOLTS: 'Ultrabolts',
    XCYCLOPS: 'xCyclops',
    PULL_TEST_OPERATOR: 'Pull-Test Operator',
  };

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
      role: 'COMPANY_USER',
      appsAccess: [],
    };

    return permissions[0] || defaultPermission;
  };

  const getRoleDisplayName = (role: UserPermission['role']): string => {
    switch (role) {
      case 'COMPANY_USER':
        return 'User';
      case 'COMPANY_ADMIN':
        return 'Admin';
      case 'SANDVIK_TECHNICIAN':
        return 'Technician';
      case 'SANDVIK_ADMIN':
        return 'S. Admin';
    }
  };

  const getBadge = (
    role: UserPermission['role'],
  ): {
    variant: 'neutral' | 'primary';
    icon: React.ReactNode;
  } => {
    switch (role) {
      case 'COMPANY_USER':
        return { variant: 'neutral', icon: <LucideUser /> };
      case 'COMPANY_ADMIN':
        return { variant: 'primary', icon: <LucideKey /> };
      case 'SANDVIK_TECHNICIAN':
        return { variant: 'neutral', icon: <LucidePickaxe /> };
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
    await deleteUser(users[index].id);
  };

  const openEditModal = (index: number) => {
    const userToEdit = users[index];
    onSelectUser(userToEdit);
    onOpenChange(true);
  };

  const columns: ColumnDef<ICompanyUser>[] = [
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
      accessorFn: (row) => row.userPermissions,
      cell: ({ row }) => {
        const userPerm = getUserPermissions(row.original.userPermissions);
        const appAccessValue = userPerm?.appsAccess || [];

        if (appAccessValue.length === 1) {
          return appAccessFullNames[appAccessValue[0]];
        }

        // write more clear code something checking for max length
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
            {getRoleDisplayName(userPermissionRole)}
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
