'use client';
import {
  Role,
  User,
  Application,
  UserPermission,
  GetCompanyUsersQuery,
} from '@/gql/graphql';
import { graphql } from '@/gql';
import { useClient, useMutation } from 'urql';
import { useParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Badge, DataTable, Text } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { LucideKey, LucidePickaxe, LucideUser } from 'lucide-react';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';

type UsersTableProps = {
  companyData?: GetCompanyUsersQuery;
  onSelectUser: (user: User) => void;
  onOpenChange: (open: boolean) => void;
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
    COMPANY_USER: 'User',
    COMPANY_ADMIN: 'Admin',
    SANDVIK_ADMIN: 'Sandvik Admin',
    SANDVIK_TECHNICIAN: 'Technician',
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

// const deleteUserMutation = graphql(`
//   mutation deleteUser($id: String!) {
//     removeUser(id: $id) {
//       id
//     }
//   }
// `);

export const UsersTable = ({
  companyData,
  onOpenChange,
  onSelectUser,
}: UsersTableProps) => {
  const params = useParams();
  const companyId = params.id as string;
  const [isDeleting, setIsDeleting] = useState(false);
  const users = (companyData?.company.users as User[]) || [];
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | undefined>(
    undefined,
  );
  const [, deleteUserPermission] = useMutation(deleteUserPermissionMutation);

  const fullNameOfUserToDelete = users.find(
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
      case Role.SandvikAdmin:
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

  const handleDelete = async (): Promise<boolean> => {
    const userToDeleteFound = users.find((user) => user.id === userToDelete);
    const userPermissionToDelete = userToDeleteFound?.userPermissions?.find(
      (userPerm) => userPerm.companyId === companyId,
    );

    // check for userPermId, cant delete if type is undefined
    if (!userPermissionToDelete?.id) {
      console.log('No user permission found to delete');
      return Promise.resolve(false);
    }

    setIsDeleting(true);
    return deleteUserPermission({
      id: userPermissionToDelete.id,
    })
      .then((result) => {
        if (result.error) {
          console.log('Error deleting user permission:', result.error);
          return false;
        }
        setIsDeleting(true);
        return true;
      })
      .catch((error) => {
        console.log('Error deleting user permission:', error);
        return false;
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const openEditModal = (userId: string) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      onSelectUser(userToEdit);
      onOpenChange(true);
    }
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
        deleteIcon="User"
        modalTitle="Delete user"
        isLoading={isDeleting}
        isOpen={isDeleteUserModalOpen}
        onDelete={handleDelete}
        onClose={closeDeleteModal}
        onOpenChange={closeDeleteModal}
      >
        <Text variant="medium" color={'foreground'}>
          You are about to delete
          <Text variant="medium" color={'foreground'} isBold as="span">
            {` ${fullNameOfUserToDelete} `}
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
