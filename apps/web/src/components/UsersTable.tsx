'use client';
import { graphql } from '@/gql';
import { useState } from 'react';
import {
  Application,
  GetCompanyUsersQuery,
  Role,
  User,
  UserPermission,
} from '@/gql/graphql';
import { Badge, DataTable, Text } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { LucideKey, LucidePickaxe, LucideUser } from 'lucide-react';
import { useMutation } from 'urql';
import { useParams } from 'next/navigation';

type UsersTableProps = {
  companyData?: GetCompanyUsersQuery;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (user: User) => void;
};

// @TODO create a utils folder and add these kind of functions there
export const formatAppName = (appName: string): string => {
  const appNames: Record<string, string> = {
    PULL_TEST: 'Pull Test',
    ULTRABOLTS: 'Ultrabolts',
    XCYCLOPS: 'Cyclops',
    PULL_TEST_OPERATOR: 'Pull Test Operator',
  };

  return appNames[appName] || appName;
};

export const formatRoleName = (role: string): string => {
  const roleNames: Record<string, string> = {
    SANDVIK_TECHNICIAN: 'Technician',
    COMPANY_ADMIN: 'Admin',
    COMPANY_USER: 'User',
  };

  return roleNames[role] || role;
};

const deleteUserPermissionMutation = graphql(`
  mutation deleteUserPermission($id: String!) {
    removeUserPermission(id: $id) {
      id
    }
  }
`);

export const UsersTable = ({
  companyData,
  onOpenChange,
  onSelectUser,
}: UsersTableProps) => {
  const params = useParams();
  const companyId = params.id as string;
  const users = (companyData?.company.users as User[]) || [];

  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  const [, deleteUser] = useMutation(deleteUserPermissionMutation);

  const [userToDelete, setUserToDelete] = useState<string | undefined>(
    undefined,
  );

  const userToDeleteName = users.find(
    (user) => user.id === userToDelete,
  )?.fullName;

  // TODO Move to utils
  const getBadge = (
    userPermissions?: UserPermission,
  ): {
    variant: 'neutral' | 'primary';
    icon: React.ReactNode;
  } => {
    const role = userPermissions?.role || 'User';
    switch (role) {
      case Role.CompanyUser:
        return { variant: 'neutral', icon: <LucideUser /> };
      case Role.SandvikTechnician:
        return { variant: 'neutral', icon: <LucidePickaxe /> };
      case Role.CompanyAdmin:
        return { variant: 'primary', icon: <LucideKey /> };
      default:
        return { variant: 'neutral', icon: <LucideUser /> };
    }
  };

  const getAppShortening = (appAccessValue: Application[]) => {
    const applicationsCount = Object.keys(Application).length;

    if (appAccessValue.length === applicationsCount) {
      return <Badge variant="primary">All Apps</Badge>;
    }

    const appName = appAccessValue
      .map((app: string) => formatAppName(app) || app)
      .join(', ');

    return appName;
  };

  const openDeleteModal = (index: string) => {
    setUserToDelete(index);
    setIsDeleteUserModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteUserModalOpen(false);
    setUserToDelete(undefined);
  };

  const handleDelete = (userId?: string) => {
    if (userId) {
      const userToDelete = users.find((user) => user.id === userId);

      if (userToDelete) {
        const userPermissionToDelete = userToDelete.userPermissions?.find(
          (userPerm) => userPerm.companyId === companyId,
        );

        if (userPermissionToDelete) {
          deleteUser({
            id: userPermissionToDelete.id,
          }).catch((error) => {
            // TODO add toaster
            console.log('error deleting user permission', error);
          });
        }
      }
    }
  };

  const openEditModal = (index: string) => {
    const userToEdit = users[parseInt(index)];
    onSelectUser(userToEdit);
    onOpenChange(true);
  };

  const columns: ColumnDef<User>[] = [
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
      accessorFn: (row) => {
        const allApps =
          row.userPermissions?.flatMap((perm) => perm.appsAccess || []) || [];
        return Array.from(new Set(allApps));
      },
      cell: ({ row }) => {
        const appAccessValue = row.getValue('appsAccess') as Application[];
        return getAppShortening(appAccessValue) || 'N/A';
      },
    },
    {
      accessorKey: 'userPermissions.role',
      header: 'Role',
      cell: ({ row }) => {
        const userPermission = row.original.userPermissions?.[0];
        const role = userPermission?.role || 'N/A';
        const { variant, icon } = getBadge(userPermission);

        return (
          <Badge variant={variant}>
            {icon}
            {formatRoleName(role)}
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
        return (
          <DeleteEditDropdown
            itemSelected={row.original.id}
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
        deleteButtonText="Delete user"
        deleteIcon="User"
        modalTitle="Delete user"
        isOpen={isDeleteUserModalOpen}
        onOpenChange={closeDeleteModal}
        onDelete={() => {
          handleDelete(userToDelete);
          closeDeleteModal();
        }}
      >
        <Text variant="medium" color={'foreground'}>
          You are about to delete
          <Text variant="medium" color={'foreground'} isBold as="span">
            {` ${userToDeleteName} `}
          </Text>
          from the list. Are you sure you want to delete?
        </Text>
      </DeleteModalConfirmation>

      <DataTable
        columns={columns}
        data={users}
        noResultMessage="There are no users added yet."
      />
      {users.length > 0 && (
        <Badge variant="neutral" className="self-start">
          {users.length} total
        </Badge>
      )}
    </>
  );
};
