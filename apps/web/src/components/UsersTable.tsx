'use client';
import {
  Role,
  User,
  Application,
  UserPermission,
  GetCompanyUsersQuery,
} from '@/gql/graphql';
import { graphql } from '@/gql';
import { useState } from 'react';
import { useMutation } from 'urql';
import { useParams } from 'next/navigation';
import { Badge, DataTable, Text, showAlertToast } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import {
  LucideKey,
  LucidePickaxe,
  LucideUser,
  LucideSearchX,
} from 'lucide-react';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { getAppName, handleGraphQLErrors } from '@/libs/utils';
import { responses } from '@/app/uitexts/responses';

type UsersTableProps = {
  availableCompanyPlans: Application[];
  companyData?: GetCompanyUsersQuery;
  onSelectUser: (user: User) => void;
  onOpenChange: (open: boolean) => void;
};

const formatRoleName = (role: string): string => {
  const roleNames: Record<string, string> = {
    COMPANY_USER: 'User',
    COMPANY_ADMIN: 'Admin',
    SANDVIK_TECHNICIAN: 'Technician',
  };
  return roleNames[role] || role;
};

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

const getAppShortening = (
  appAccessValue: Application[],
  availableCompanyPlans: Application[],
) => {
  if (appAccessValue.length === availableCompanyPlans.length) {
    return <Badge variant="primary">All Apps</Badge>;
  }
  const appName = appAccessValue
    .map((app: string) => getAppName(app as Application) || app)
    .join(', ');
  return appName;
};

const deleteUserPermissionMutation = graphql(`
  mutation deleteUserPermission($id: String!) {
    removeUserPermission(id: $id) {
      id
    }
  }
`);

export const UsersTable = ({
  availableCompanyPlans,
  companyData,
  onOpenChange,
  onSelectUser,
}: UsersTableProps) => {
  const params = useParams();
  const companyId = params.id as string;

  // Show all users except Sandvik Admin
  const users = (companyData?.company?.users?.filter(
    (user) => user.globalRole !== Role.SandvikAdmin,
  ) || []) as User[];

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | undefined>(
    undefined,
  );

  const [, deleteUserPermission] = useMutation(deleteUserPermissionMutation);

  const fullNameOfUserToDelete = users.find(
    (user) => user.id === userToDelete,
  )?.fullName;

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

    if (!userPermissionToDelete?.id) {
      return false;
    }

    setIsDeleting(true);
    return (
      deleteUserPermission({ id: userPermissionToDelete.id })
        .then((result) => {
          // Backend errors
          const hasGraphQLErrors = handleGraphQLErrors(result.error);
          if (hasGraphQLErrors) {
            return false;
          }
          // Success
          if (result.data) {
            setTimeout(() => {
              closeDeleteModal();

              showAlertToast({
                title: responses.userPermissionDeleteSuccess,
                variant: 'info',
              });
            }, 1200);
          }
          return true;
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.userPermissionDeleteFailed,
            description: responses.contactSupportError,
            variant: 'error',
          });
          return false;
        })
        .finally(() => {
          setIsDeleting(false);
        })
    );
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
        return getAppShortening(appAccessValue, availableCompanyPlans) || 'N/A';
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
        modalDeleteButtonText="Delete user"
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
        icon={<LucideSearchX color="gray" />}
      />
      {users.length > 0 && (
        <Badge variant="neutral" className="self-start">
          {users.length} total
        </Badge>
      )}
    </>
  );
};
