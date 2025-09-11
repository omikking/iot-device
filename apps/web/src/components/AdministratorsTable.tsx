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
import { useMutation } from 'urql';
import { LucideHourglass, LucideUserCog } from 'lucide-react';
import { GetAdminsQuery } from '@/gql/graphql';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { responses } from '@/app/uitexts/responses';
import { handleGraphQLErrors } from '@/libs/utils';
import { LucideSearchX } from 'lucide-react';

type Administrator = GetAdminsQuery['users'][0];

type AdminRow = Administrator & { isInvitation: boolean; expiresAt?: string };

type AdministratorsTableProps = {
  allAdmins: AdminRow[];
  refreshAdmins: () => void;
};

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

export const AdministratorsTable = ({
  allAdmins,
  refreshAdmins,
}: AdministratorsTableProps) => {
  // Admin delete modal state
  const [isDeleteAdministratorModalOpen, setIsDeleteAdministratorModalOpen] =
    useState(false);
  const [administratorToDelete, setAdministratorToDelete] = useState<
    Administrator | undefined
  >(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, deleteAdmin] = useMutation(deleteAdminMutation);

  // Invitation cancel modal state
  const [isCancelInvitationModalOpen, setIsCancelInvitationModalOpen] =
    useState(false);
  const [invitationToCancel, setInvitationToCancel] = useState<
    AdminRow | undefined
  >(undefined);
  const [isCancelInvitation, setIsCancelInvitation] = useState(false);
  const [, resendInvitation] = useMutation(resendInvitationMutation);
  const [, cancelInvitation] = useMutation(cancelInvitationMutation);

  // Admin delete logic
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
          handleGraphQLErrors(result.error);
          // Success
          if (result.data) {
            setTimeout(() => {
              showAlertToast({
                title: responses.adminDeleteSuccess,
                variant: 'success',
              });
              refreshAdmins();
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

  // Invitation delete logic
  const openCancelInvitationModal = (invitationId: string) => {
    const invitation = allAdmins?.find((admin) => admin.id === invitationId);
    setInvitationToCancel(invitation);
    setIsCancelInvitationModalOpen(true);
  };

  const closeCancelInvitationModal = () => {
    setIsCancelInvitationModalOpen(false);
    setInvitationToCancel(undefined);
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
          handleGraphQLErrors(result.error);
          // Success
          if (result.data) {
            setTimeout(() => {
              showAlertToast({
                title: responses.invitationCancelSuccess,
                variant: 'info',
              });
              refreshAdmins();
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
        .finally(() => {
          setIsCancelInvitation(false);
        })
    );
  };

  // Resend invitation handler
  const handleResendInvitation = async (id: string): Promise<boolean> => {
    return (
      resendInvitation({ id })
        .then((result) => {
          // Backend errors
          handleGraphQLErrors(result.error);
          // Success
          if (result.data) {
            showAlertToast({
              title: responses.invitationResendSuccess,
              variant: 'success',
            });
            refreshAdmins();
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
        if (row.original.isInvitation) {
          return (
            <DeleteEditDropdown
              itemSelected={row.original.id}
              onResendInvitation={handleResendInvitation}
              onCancelInvitation={openCancelInvitationModal}
            />
          );
        }
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
      {/* Admin delete modal */}
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

      {/* Invitation delete modal */}
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
