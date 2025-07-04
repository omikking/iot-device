'use client';
import { graphql } from '@/gql';
import { useState } from 'react';
import { User } from '@/gql/graphql';
import { useMutation, useQuery } from 'urql';
import { Badge, DataTable, Text, showAlertToast } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { LucideEyeOff, LucideView } from 'lucide-react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { responses } from '@/app/uitexts/responses';
import { GraphQLErrorExtensions } from '@/libs/utils';

const getTechniciansQuery = graphql(`
  query getTechnicians {
    users(roles: "SANDVIK_TECHNICIAN") {
      id
      fullName
      email
      workPlace
      isGlobalVisibility
      phoneNumber
      globalRole
    }
  }
`);

const deleteTechnicianMutation = graphql(`
  mutation deleteTechnician($id: String!) {
    removeUser(id: $id) {
      id
    }
  }
`);

type TechniciansTableProps = {
  onOpenChange: (open: boolean) => void;
  onSelectTechnician: (technician?: User) => void;
};

export const TechniciansTable = ({
  onOpenChange,
  onSelectTechnician,
}: TechniciansTableProps) => {
  const [isDeleteTechnicianModalOpen, setDeleteTechnicianModalOpen] =
    useState(false);
  const [technicianToDelete, setTechnicianToDelete] = useState<
    User | undefined
  >(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const [techniciansData] = useQuery({
    query: getTechniciansQuery,
  });
  const [, deleteTechnician] = useMutation(deleteTechnicianMutation);

  const technicians = (techniciansData.data?.users as User[]) || [];

  const openDeleteModal = (technicianId: string) => {
    const technicianToDelete = technicians?.find(
      (technician) => technician.id === technicianId,
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
          if (result.error?.graphQLErrors) {
            const { title, message, type } = result.error.graphQLErrors[0]
              .extensions as unknown as GraphQLErrorExtensions;

            showAlertToast({
              title: title,
              description: message,
              variant: type || 'error',
            });
            return false;
          }
          // Success
          if (result.data) {
            setTimeout(() => {
              showAlertToast({
                title: responses.techinicianDeleteSuccess,
                variant: 'info',
              });
            }, 1500);
          }
          return true;
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.techinicianDeleteFailed,
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

  const openEditModal = (technicianId: string) => {
    const technicianToEdit = technicians?.find(
      (technician) => technician.id === technicianId,
    );
    onSelectTechnician(technicianToEdit);
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
      meta: {
        headerClassName: 'w-80',
      },
    },
    {
      accessorKey: 'workPlace',
      header: 'Company',
      meta: {
        headerClassName: 'w-44',
      },
    },
    {
      accessorKey: 'isGlobalVisibility',
      header: 'Visible globally',
      cell: ({ row }) => (
        <>
          {row.getValue('isGlobalVisibility') && (
            <Badge variant="success">
              <LucideView />
              Visible
            </Badge>
          )}
          {!row.getValue('isGlobalVisibility') && (
            <Badge variant="neutral">
              <LucideEyeOff />
              Private
            </Badge>
          )}
        </>
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
        const technician = technicians.find(
          (technician) => technician.id === row.original.id,
        );
        return (
          technician && (
            <DeleteEditDropdown
              itemSelected={technician.id}
              openDeleteModal={openDeleteModal}
              handleEdit={openEditModal}
            />
          )
        );
      },
    },
  ];

  return (
    <>
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
          You are about to delete
          <Text variant="medium" color={'foreground'} isBold as="span">
            {` ${technicianToDelete?.fullName} `}
          </Text>
          from the list. Are you sure you want to delete?
        </Text>
      </DeleteModalConfirmation>

      <DataTable
        columns={columns}
        data={technicians}
        noResultMessage="There are no technicians added yet."
      />

      {technicians?.length > 0 && (
        <Badge variant="neutral" className="self-start">
          {technicians.length} total
        </Badge>
      )}
    </>
  );
};
