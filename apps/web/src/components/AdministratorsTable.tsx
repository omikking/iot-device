'use client';
import {
  Text,
  Badge,
  ColumnDef,
  DataTable,
  TableHeadWithSorting,
  showAlertToast,
} from '@gsp/ui';
import { graphql } from '@/gql';
import { useState } from 'react';
import { useMutation, useQuery } from 'urql';
import { LucideHourglass, LucideUserCog } from 'lucide-react';
import { GetAdminsQuery, Role } from '@/gql/graphql';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { responses } from '@/app/uitexts/responses';
import { handleGraphQLErrors } from '@/libs/utils';
import { LucideSearchX } from 'lucide-react';

type Administrator = GetAdminsQuery['users'][0];
type AdminRow = Administrator & { isInvitation: boolean; expiresAt?: string };

const getPendingAdminsQuery = graphql(`
  query getPendingGlobalInvitations {
    pendingGlobalInvitations {
      id
      email
      globalRole
      expiresAt
      used
    }
  }
`);

const getAdminsQuery = graphql(`
  query getAdmins {
    users(roles: "SANDVIK_ADMIN") {
      id
      createdAt
      email
      fullName
      workPlace
      phoneNumber
      globalRole
    }
  }
`);

const deleteAdminMutation = graphql(`
  mutation deleteAdmin($id: String!) {
    removeUser(id: $id) {
      id
      email
      fullName
      workPlace
      phoneNumber
      globalRole
    }
  }
`);

export const AdministratorsTable = () => {
  const [administratorsData] = useQuery({
    query: getAdminsQuery,
  });
  const [pendingAdminsData] = useQuery({
    query: getPendingAdminsQuery,
  });

  const administrators =
    (administratorsData?.data?.users as GetAdminsQuery['users']) || [];

  const invitations = (pendingAdminsData?.data?.pendingGlobalInvitations || [])
    .filter(
      (pendingAdmin) =>
        pendingAdmin.globalRole === Role.SandvikAdmin && !pendingAdmin.used,
    )
    .map((pendingAdmin) => ({
      id: pendingAdmin.id,
      email: pendingAdmin.email,
      fullName: '',
      workPlace: 'N/A',
      phoneNumber: 'N/A',
      globalRole: pendingAdmin.globalRole,
      expiresAt: pendingAdmin.expiresAt,
      createdAt: undefined,
      isInvitation: true,
    }));

  // Add a flag to real users for sorting
  const adminUsers = administrators.map((user) => ({
    ...user,
    isInvitation: false,
    createdAt: user.createdAt,
    expiresAt: undefined,
  }));

  // Combine and sort admins and pending admins by date
  const allAdmins: AdminRow[] = [...adminUsers, ...invitations].sort((a, b) => {
    const aDate = a.isInvitation
      ? new Date(a.expiresAt)
      : new Date(a.createdAt);
    const bDate = b.isInvitation
      ? new Date(b.expiresAt)
      : new Date(b.createdAt);
    return bDate.getTime() - aDate.getTime();
  });

  const [isDeleteAdministratorModalOpen, setIsDeleteAdministratorModalOpen] =
    useState(false);

  const [administratorToDelete, setAdministratorToDelete] = useState<
    Administrator | undefined
  >(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, deleteAdmin] = useMutation(deleteAdminMutation);

  const openDeleteModal = (adminId: string) => {
    const adminToDelete = allAdmins?.find((admin) => admin.id === adminId);
    setAdministratorToDelete(adminToDelete);
    setIsDeleteAdministratorModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteAdministratorModalOpen(false);
    setAdministratorToDelete(undefined);
  };

  const handleDelete = async (): Promise<boolean> => {
    if (!administratorToDelete?.id) {
      return false;
    }

    setIsDeleting(true);

    return (
      deleteAdmin({ id: administratorToDelete.id })
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
                title: responses.adminDeleteSuccess,
                variant: 'success',
              });
            }, 1500);
          }
          return true;
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.adminDeleteFailed,
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

  const columns: ColumnDef<AdminRow>[] = [
    {
      accessorKey: 'fullName',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Full name" />
      ),
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
      meta: {
        headerClassName: 'w-80',
      },
    },
    {
      accessorKey: 'workPlace',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Company" />
      ),
    },
    {
      accessorKey: 'globalRole',
      header: 'Role',
      cell: () => (
        <Badge variant="primary">
          <LucideUserCog />
          Sandvik admin
        </Badge>
      ),
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
          />
        );
      },
    },
  ];

  return (
    <>
      <DeleteModalConfirmation
        deleteIcon="User"
        modalTitle="Delete administrator"
        modalDeleteButtonText="Delete administrator"
        isLoading={isDeleting}
        isOpen={isDeleteAdministratorModalOpen}
        onDelete={handleDelete}
        onClose={closeDeleteModal}
        onOpenChange={closeDeleteModal}
      >
        <Text variant="medium" color={'foreground'}>
          You are about to delete
          <Text variant="medium" color={'foreground'} isBold as="span">
            {` ${administratorToDelete?.fullName} `}
          </Text>
          from the list. Are you sure you want to delete?
        </Text>
      </DeleteModalConfirmation>

      <DataTable
        columns={columns}
        data={allAdmins}
        noResultMessage="There are no administrators or pending invitations."
        icon={<LucideSearchX className="text-neutral-5" />}
      />
      {allAdmins?.length > 0 && (
        <Badge variant="neutral" className="self-start">
          {allAdmins.length} total
        </Badge>
      )}
    </>
  );
};
