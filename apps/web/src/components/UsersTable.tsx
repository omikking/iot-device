'use client';
import { graphql } from '@/gql';
import { useState } from 'react';
import { User, UserPermission } from '@/gql/graphql';
import { Badge, DataTable, Text } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { Application } from '@/app/mock/mock';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { LucideKey, LucidePickaxe, LucideUser } from 'lucide-react';
import { useQuery, useMutation } from 'urql';
import { useSession } from 'next-auth/react';

type UsersTableProps = {
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
    SANDVIK_TECHNICIAN: 'Sandvik technician',
    SANDVIK_ADMIN: 'Sandvik admin',
    COMPANY_ADMIN: 'Company admin',
    COMPANY_USER: 'User',
  };

  return roleNames[role] || role;
};

const getCompanyUserQuery = graphql(`
  query getCompanyUser($id: String!) {
    company(id: $id) {
      id
      users {
        id
        email
        fullName
        workPlace
        phoneNumber
        globalRole
        userPermissions {
          id
          userId
          companyId
          role
          appsAccess
        }
      }
    }
  }
`);

const deleteUserPermissionMutation = graphql(`
  mutation deleteUserPermission($id: String!) {
    removeUserPermission(id: $id) {
      id
      userId
      companyId
      role
      appsAccess
    }
  }
`);

export const UsersTable = ({ onOpenChange, onSelectUser }: UsersTableProps) => {
  const { data: session } = useSession();

  const [{ data: companyData }] = useQuery({
    query: getCompanyUserQuery,
    variables: { id: session?.company?.id || '' },
  });

  const users = (companyData?.company?.users as User[]) || [];

  const [, executeDeleteMutation] = useMutation(deleteUserPermissionMutation);

  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  // Redo this to a number and instead of using parseInt everywhere
  const [userToDelete, setUserToDelete] = useState<string | undefined>(
    undefined,
  );

  const getBadge = (
    userPermissions?: UserPermission,
  ): {
    variant: 'neutral' | 'primary';
    icon: React.ReactNode;
  } => {
    const role = userPermissions?.role || 'User';
    switch (role) {
      case 'COMPANY_USER':
        return { variant: 'neutral', icon: <LucideUser /> };
      case 'SANDVIK_TECHNICIAN':
        return { variant: 'neutral', icon: <LucidePickaxe /> };
      case 'SANDVIK_ADMIN':
        return { variant: 'primary', icon: <LucideKey /> };
      case 'COMPANY_ADMIN':
        return { variant: 'primary', icon: <LucideKey /> };
      default:
        return { variant: 'neutral', icon: <LucideUser /> };
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

  const openDeleteModal = (index: string) => {
    setUserToDelete(index);
    setIsDeleteUserModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteUserModalOpen(false);
    setUserToDelete(undefined);
  };

  const handleDelete = (index: string | undefined) => {
    if (index) {
      const userPermissionToDelete = users[
        parseInt(index)
      ].userPermissions?.find(
        (userPerm) =>
          userPerm.userId === users[parseInt(index)].id &&
          userPerm.companyId === session?.company?.id,
      );

      if (userPermissionToDelete) {
        executeDeleteMutation({
          id: userPermissionToDelete.id,
        }).catch((error) => {
          console.log('error deleting userPerm', error);
        });
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
        const rowIndex = users.findIndex((user) => user.id === row.original.id);

        return (
          <DeleteEditDropdown
            itemSelected={rowIndex.toString()}
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
        onOpenChange={closeDeleteModal}
        onDelete={() => {
          handleDelete(userToDelete);
          closeDeleteModal();
        }}
      >
        <Text variant="medium" color={'foreground'}>
          You are about to delete
          <Text variant="medium" color={'foreground'} isBold as="span">
            {userToDelete !== undefined &&
              ` ${users[parseInt(userToDelete)].fullName} `}
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
