'use client';
import { useState } from 'react';
import { Badge, DataTable, Text } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { LucideEyeOff, LucideView } from 'lucide-react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { graphql } from '@/gql';
import { useMutation, useQuery } from 'urql';
import { User } from '@/gql/graphql';

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

  const [techniciansData] = useQuery({
    query: getTechniciansQuery,
  });
  const technicians = (techniciansData.data?.users as User[]) || [];

  const [, deleteTechnician] = useMutation(deleteTechnicianMutation);

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

  const handleDelete = () => {
    if (technicianToDelete) {
      deleteTechnician({
        id: technicianToDelete.id,
      }).then(() => {
        closeDeleteModal();
      });
    }
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
      {technicianToDelete && (
        <DeleteModalConfirmation
          deleteButtonText="Confirm deletion"
          deleteIcon="User"
          modalTitle="Delete technician"
          isOpen={isDeleteTechnicianModalOpen}
          onOpenChange={closeDeleteModal}
          onDelete={handleDelete}
        >
          <Text variant="medium" color={'foreground'}>
            You are about to delete
            <Text variant="medium" color={'foreground'} isBold as="span">
              {` ${technicianToDelete.fullName} `}
            </Text>
            from the list. Are you sure you want to delete?
          </Text>
        </DeleteModalConfirmation>
      )}

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
