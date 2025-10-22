'use client';
import { graphql } from '@/gql';
import { useState } from 'react';
import { User } from '@/gql/graphql';
import { useMutation } from 'urql';
import {
  Badge,
  DataTable,
  Text,
  showAlertToast,
  TableHeadWithSorting,
} from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import {
  LucideEyeOff,
  LucideView,
  LucideSearchX,
  LucideHourglass,
} from 'lucide-react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { responses } from '@/app/uitexts/responses';
import { handleGraphQLErrors } from '@/libs/utils';

export type TechnicianRow = User & {
  isInvitation: boolean;
  expiresAt?: string;
};

type TechniciansTableProps = {
  allTechnicians: TechnicianRow[];
  refreshTechnicians: () => void;
  onOpenChange: (open: boolean) => void;
  onSelectTechnician: (technician?: User) => void;
};

const deleteTechnicianMutation = graphql(`
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

export const TechniciansTable = ({
  allTechnicians,
  refreshTechnicians,
  onOpenChange,
  onSelectTechnician,
}: TechniciansTableProps) => {
  // Delete modal state
  const [isDeleteTechnicianModalOpen, setDeleteTechnicianModalOpen] =
    useState(false);
  const [technicianToDelete, setTechnicianToDelete] = useState<
    TechnicianRow | undefined
  >(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const [, deleteTechnician] = useMutation(deleteTechnicianMutation);
  const [, resendInvitation] = useMutation(resendInvitationMutation);
  const [, cancelInvitation] = useMutation(cancelInvitationMutation);

  // Invitation cancel modal state
  const [isCancelInvitationModalOpen, setIsCancelInvitationModalOpen] =
    useState(false);
  const [invitationToCancel, setInvitationToCancel] = useState<
    TechnicianRow | undefined
  >(undefined);
  const [isCancelInvitation, setIsCancelInvitation] = useState(false);

  const openDeleteModal = (technicianId: string) => {
    const technicianToDelete = allTechnicians?.find(
      (t) => t.id === technicianId,
    );
    setTechnicianToDelete(technicianToDelete);
    setDeleteTechnicianModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteTechnicianModalOpen(false);
    setTechnicianToDelete(undefined);
  };

  const handleDelete = async (): Promise<boolean> => {
    if (!technicianToDelete?.id) {
      return false;
    }
    setIsDeleting(true);
    return (
      deleteTechnician({ id: technicianToDelete.id })
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
                title: responses.technicianDeleteSuccess,
                variant: 'info',
              });
              refreshTechnicians();
            }, 1500);
          }
          return true;
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.technicianDeleteFailed,
            description: responses.contactSupportError,
            variant: 'error',
          });
          return false;
        })
        .finally(() => setIsDeleting(false))
    );
  };

  // Invitation cancel logic
  const openCancelInvitationModal = (invitationId: string) => {
    const invitation = allTechnicians?.find((t) => t.id === invitationId);
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
              refreshTechnicians();
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

  // Resend invitation handler
  const handleResendInvitation = async (id: string): Promise<boolean> => {
    return (
      resendInvitation({ id })
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
            refreshTechnicians();
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

  const openEditModal = (technicianId: string) => {
    const technicianToEdit = allTechnicians?.find((t) => t.id === technicianId);

    if (technicianToEdit && !technicianToEdit.isInvitation) {
      onSelectTechnician(technicianToEdit);
      onOpenChange(true);
    }
  };

  const columns: ColumnDef<TechnicianRow>[] = [
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
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Email" />
      ),
      meta: { headerClassName: 'w-80' },
    },
    {
      accessorKey: 'workPlace',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Company" />
      ),
      meta: { headerClassName: 'w-44' },
    },
    {
      accessorKey: 'isGlobalVisibility',
      header: 'Visible globally',
      cell: ({ row }) =>
        row.getValue('isGlobalVisibility') ? (
          <Badge variant="success">
            <LucideView />
            Visible
          </Badge>
        ) : (
          <Badge variant="neutral">
            <LucideEyeOff />
            Private
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
            handleEdit={openEditModal}
          />
        );
      },
    },
  ];

  return (
    <>
      {/* Delete technician modal */}
      <DeleteModalConfirmation
        deleteIcon="User"
        modalTitle="Delete technician"
        modalDeleteButtonText="Delete technician"
        isLoading={isDeleting}
        isOpen={isDeleteTechnicianModalOpen}
        onDelete={handleDelete}
        onClose={closeDeleteModal}
        onOpenChange={closeDeleteModal}
      >
        <Text variant="medium" color={'foreground'}>
          Are you sure you want to permanently remove
          <Text variant="medium" color={'foreground'} isBold as="span">
            {` ${technicianToDelete?.fullName} `}
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
        data={allTechnicians}
        noResultMessage="There are no technicians added yet."
        icon={<LucideSearchX className="text-neutral-5" />}
      />

      {allTechnicians?.length > 0 && (
        <Badge variant="neutral" className="self-start">
          {allTechnicians.length} total
        </Badge>
      )}
    </>
  );
};
