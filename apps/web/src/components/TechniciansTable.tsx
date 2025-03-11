'use client';
import { useState } from 'react';
import { Badge, DataTable, Text } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { LucideEyeOff, LucideView } from 'lucide-react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { TechniciansSchema } from '@/app/mock/mock';
import { useMutation, useQuery } from 'urql';

import {
  getUserQuery,
  removeTechnicianQuery,
} from './urql-technicians/TechnicianClientUrql';

interface TechniciansTableProps {
  onOpenChange: (open: boolean) => void;
  onSelectTechnician: (technician: TechniciansSchema) => void;
}
export const TechniciansTable = ({
  onOpenChange,
  onSelectTechnician,
}: TechniciansTableProps) => {
  const [result] = useQuery({ query: getUserQuery });
  const [, removeTechnician] = useMutation(removeTechnicianQuery);
  // const [technicians, setTechnicians] = useState(techniciansMock);
  const [isDeleteTechnicianModalOpen, setIsDeleteTechnicianModalOpen] =
    useState(false);
  const [technicianToDelete, setTechnicianToDelete] = useState<
    number | undefined
  >(undefined);

  const openDeleteModal = (index: number) => {
    setTechnicianToDelete(index);
    setIsDeleteTechnicianModalOpen(true);
  };

  // get the index of the technician to edit and pass it to the modal
  const openEditModal = (index: number) => {
    const technicianToEdit = technicians[index];
    onSelectTechnician(technicianToEdit);
    onOpenChange(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteTechnicianModalOpen(false);
    setTechnicianToDelete(undefined);
  };

  const handleDelete = (index: number) => {
    const id = technicians[index].id;
    removeTechnician({ id })
      .then((result) => {
        console.log('User removed:', result);
      })
      .catch((error) => {
        console.error('Error removing user:', error);
      });
  };

  const columns: ColumnDef<TechniciansSchema>[] = [
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
      header: 'workPlace',
      meta: {
        headerClassName: 'w-44',
      },
    },
    {
      accessorKey: 'isGlobalVisibility',
      header: 'Visible globally',
      cell: ({ row }) => {
        const isVisible = Boolean(row.getValue('isGlobalVisibility'));

        return (
          <>
            {isVisible ? (
              <Badge variant="success">
                <LucideView />
                Visible
              </Badge>
            ) : (
              <Badge variant="neutral">
                <LucideEyeOff />
                Private
              </Badge>
            )}
          </>
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
        const rowIndex = technicians.findIndex(
          (tech: { id: string }) => tech.id === row.original.id,
        );

        return (
          <DeleteEditDropdown
            itemSelected={rowIndex}
            openDeleteModal={openDeleteModal}
            // when the edit button is clicked, the index of the technician is passed to the modal
            handleEdit={openEditModal}
          />
        );
      },
    },
  ];

  if (result.fetching) return <div>Loading...</div>;
  if (result.error) return <div>Error: {result.error.message}</div>;
  const technicians = result.data.users;

  return (
    <>
      <DeleteModalConfirmation
        deleteButtonText="Confirm deletion"
        deleteIcon="User"
        modalTitle="Delete technician"
        isOpen={isDeleteTechnicianModalOpen}
        itemToDelete={technicianToDelete}
        onOpenChange={closeDeleteModal}
        onDelete={(event, index) => {
          handleDelete(index);
          closeDeleteModal();
        }}
      >
        <Text variant="medium" color={'foreground'}>
          You are about to delete
          <Text variant="medium" color={'foreground'} isBold as="span">
            {technicianToDelete !== undefined
              ? ` ${technicians[technicianToDelete].fullName} `
              : ''}
          </Text>
          from the list. Are you sure you want to delete?
        </Text>
      </DeleteModalConfirmation>

      <DataTable
        columns={columns}
        data={technicians}
        noResultMessage="There are no technicians added yet."
      />
      <Badge variant="neutral" className="self-start">
        {technicians.length} total
      </Badge>
    </>
  );
};
