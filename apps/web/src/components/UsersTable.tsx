'use client';
import { Role, User, Application } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useState } from 'react';
import { useMutation } from 'urql';
import { useParams } from 'next/navigation';
import { Badge, DataTable, Text, showAlertToast } from '@gsp/ui';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import {
  LucideKey,
  LucidePickaxe,
  LucideUser,
  LucideSearchX,
  LucideHourglass,
} from 'lucide-react';
import type { ColumnDef, CellContext } from '@tanstack/react-table';
import { getAppName, handleGraphQLErrors, isCompanyAdmin } from '@/libs/utils';
import { responses } from '@/app/uitexts/responses';
import { useSession } from 'next-auth/react';

export type UserRow = User & {
  isInvitation: boolean;
  expiresAt?: string;
  role?: string;
};

type UsersTableProps = {
  allUsers: UserRow[];
  availableCompanyPlans: Application[];
  refetchUsers: () => void;
  onSelectUser: (user: UserRow) => void;
  onOpenChange: (open: boolean) => void;
};

const resendInvitationMutation = graphql(`
  mutation resendInvitation($id: String!) {
    resendInvitation(id: $id) {
      id
      email
      expiresAt
    }
  }
`);

const cancelInvitationMutation = graphql(`
  mutation deleteInvitation($id: String!) {
    removeInvitation(id: $id) {
      id
      email
    }
  }
`);

const formatRoleName = (role: string): string => {
  const roleNames: Record<string, string> = {
    COMPANY_USER: 'User',
    COMPANY_ADMIN: 'Admin',
    SANDVIK_TECHNICIAN: 'Technician',
  };
  return roleNames[role] || role;
};

const getBadge = (
  role?: Role,
): {
  variant: 'neutral' | 'primary';
  icon: React.ReactNode;
} => {
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
  if (appAccessValue.length === 0) {
    return (
      <Text color="muted" variant="small">
        N/A
      </Text>
    );
  }
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
  allUsers,
  availableCompanyPlans,
  refetchUsers,
  onOpenChange,
  onSelectUser,
}: UsersTableProps) => {
  const [, resendInvitation] = useMutation(resendInvitationMutation);
  const [, cancelInvitation] = useMutation(cancelInvitationMutation);

  const params = useParams();
  const companyId = params.id as string;

  const { data: session } = useSession();
  const isUserSandvikAdmin = session?.user?.globalRole === Role.SandvikAdmin;
  const isUserCompanyAdmin = isCompanyAdmin(
    session?.user?.userPermissions,
    companyId,
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | undefined>(
    undefined,
  );

  // Invitation cancel modal state
  const [isCancelInvitationModalOpen, setIsCancelInvitationModalOpen] =
    useState(false);
  const [invitationToCancel, setInvitationToCancel] = useState<
    UserRow | undefined
  >(undefined);
  const [isCancelInvitation, setIsCancelInvitation] = useState(false);

  const [, deleteUserPermission] = useMutation(deleteUserPermissionMutation);

  const fullNameOfUserToDelete = allUsers.find(
    (user) => user.id === userToDelete,
  )?.fullName;

  const handleResendInvitation = async (
    invitationId: string,
  ): Promise<boolean> => {
    return (
      resendInvitation({ id: invitationId })
        .then((result) => {
          // Backend errors
          const hasGraphQLErrors = handleGraphQLErrors(result.error);
          if (hasGraphQLErrors) {
            return false;
          }
          // Success
          if (result.data) {
            showAlertToast({
              title: responses.invitationResendSuccess,
              variant: 'success',
            });
            refetchUsers();
          }
          return true;
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.invitationResendFailed,
            description: responses.contactSupportError,
            variant: 'error',
          });
          return false;
        })
    );
  };

  const handleCancelInvitation = async (): Promise<boolean> => {
    if (!invitationToCancel?.id) {
      return false;
    }
    setIsCancelInvitation(true);
    return (
      cancelInvitation({ id: invitationToCancel.id })
        .then((result) => {
          // Backend errors
          const hasGraphQLErrors = handleGraphQLErrors(result.error);
          if (hasGraphQLErrors) {
            return false;
          }
          // Success
          if (result.data) {
            setTimeout(() => {
              showAlertToast({
                title: responses.invitationCancelSuccess,
                variant: 'info',
              });
              refetchUsers();
            }, 1500);
          }
          return true;
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.invitationCancelFailed,
            description: responses.contactSupportError,
            variant: 'error',
          });
          return false;
        })
        .finally(() => setIsCancelInvitation(false))
    );
  };

  const openDeleteModal = (index: string) => {
    setUserToDelete(index);
    setIsDeleteUserModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteUserModalOpen(false);
    setUserToDelete(undefined);
  };

  // Invitation cancel logic
  const openCancelInvitationModal = (invitationId: string) => {
    const invitation = allUsers?.find((user) => user.id === invitationId);
    setInvitationToCancel(invitation);
    setIsCancelInvitationModalOpen(true);
  };

  const closeCancelInvitationModal = () => {
    setIsCancelInvitationModalOpen(false);
    setInvitationToCancel(undefined);
  };

  const openEditModal = (userId: string) => {
    const userToEdit = allUsers.find((user) => user.id === userId);
    if (userToEdit) {
      onSelectUser(userToEdit);
      onOpenChange(true);
    }
  };

  const handleDelete = async (): Promise<boolean> => {
    const userToDeleteFound = allUsers.find((user) => user.id === userToDelete);
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

  const columns: ColumnDef<UserRow>[] = [
    {
      accessorKey: 'fullName',
      header: 'Full name',
      cell: ({ row }) =>
        row.original.isInvitation ? (
          <Badge variant="pending">
            <LucideHourglass />
            Pending activation
          </Badge>
        ) : (
          row.original.fullName
        ),
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
        return getAppShortening(appAccessValue, availableCompanyPlans);
      },
    },
    {
      accessorKey: 'userPermissions.role',
      header: 'Role',
      cell: ({ row }) => {
        const isInvitation = row.original.isInvitation;
        const role = isInvitation
          ? row.original.role
          : row.original.userPermissions?.[0]?.role;

        const { variant, icon } = getBadge(role as Role);
        return (
          <Badge variant={variant}>
            {icon}
            {formatRoleName(role as Role)}
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
      cell: ({ row }: CellContext<UserRow, unknown>) => {
        if (!isUserSandvikAdmin && !isUserCompanyAdmin) {
          return null;
        }
        const isInvitation = row.original.isInvitation;
        return (
          <DeleteEditDropdown
            itemSelected={row.original.id}
            handleEdit={!isInvitation ? openEditModal : undefined}
            openDeleteModal={!isInvitation ? openDeleteModal : undefined}
            onResendInvitation={
              isInvitation ? handleResendInvitation : undefined
            }
            onCancelInvitation={
              isInvitation ? openCancelInvitationModal : undefined
            }
          />
        );
      },
    },
  ];

  return (
    <>
      {/* Delete user modal */}
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
          Are you sure you want to permanently remove
          <Text variant="medium" color={'foreground'} isBold as="span">
            {` ${fullNameOfUserToDelete} `}
          </Text>
          from the list?
        </Text>
      </DeleteModalConfirmation>

      {/* Invitation cancel modal */}
      <DeleteModalConfirmation
        deleteIcon="User"
        modalTitle="Cancel invitation"
        modalText="Confirm cancellation"
        modalDeleteButtonText="Cancel invitation"
        isLoading={isCancelInvitation}
        isOpen={isCancelInvitationModalOpen}
        onDelete={handleCancelInvitation}
        onClose={closeCancelInvitationModal}
        onOpenChange={closeCancelInvitationModal}
      >
        <Text variant="medium" color={'foreground'}>
          This will cancel the pending invitation for
          <Text variant="medium" color={'foreground'} isBold as="span">
            {` ${invitationToCancel?.email}. `}
          </Text>
          Are you sure you want to cancel this invitation?
        </Text>
      </DeleteModalConfirmation>

      <DataTable
        columns={columns}
        data={allUsers}
        noResultMessage="There are no users added yet."
        icon={<LucideSearchX className="text-neutral-5" />}
      />
      {allUsers.length > 0 && (
        <Badge variant="neutral" className="self-start">
          {allUsers.length} total
        </Badge>
      )}
    </>
  );
};
