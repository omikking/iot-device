'use client';
import { useState } from 'react';
import { Badge, DataTable, Text } from '@gsp/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { LucideEyeOff, LucideView } from 'lucide-react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { techniciansMock, TechniciansSchema } from '@/app/mock/mock';

interface TechniciansTableProps {
  onOpenChange: (open: boolean) => void;
  onSelectTechnician: (technician: TechniciansSchema) => void;
}
export const TechniciansTable = ({
  onOpenChange,
  onSelectTechnician,
}: TechniciansTableProps) => {
  const [technicians, setTechnicians] = useState(techniciansMock);
  const [isDeleteTechnicianModalOpen, setIsDeleteTechnicianModalOpen] =
    useState(false);
  const [technicianToDelete, setTechnicianToDelete] = useState<
    string | undefined
  >(undefined);

  const openDeleteModal = (index: string) => {
    setTechnicianToDelete(index);
    setIsDeleteTechnicianModalOpen(true);
  };

  // get the index of the technician to edit and pass it to the modal
  const openEditModal = (index: string) => {
    console.log(index);
    const technicianToEdit = technicians[0];
    onSelectTechnician(technicianToEdit);
    onOpenChange(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteTechnicianModalOpen(false);
    setTechnicianToDelete(undefined);
  };

  const handleDelete = () => {
    // setTechnicians((currentTechnicians) =>
    //   currentTechnicians.filter((_, i) => i !== index),
    // );
    setTechnicians((currentTechnicians) => currentTechnicians);
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
      accessorKey: 'company',
      header: 'Company',
      meta: {
        headerClassName: 'w-44',
      },
    },
    {
      accessorKey: 'isGlobal',
      header: 'Visible globally',
      cell: ({ row }) => (
        <>
          {row.getValue('isGlobal') && (
            <Badge variant="success">
              <LucideView />
              Visible
            </Badge>
          )}
          {!row.getValue('isGlobal') && (
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
        const rowIndex = technicians.findIndex(
          (tech) => tech.id === row.original.id,
        );

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
        modalTitle="Delete technician"
        isOpen={isDeleteTechnicianModalOpen}
        onOpenChange={closeDeleteModal}
        onDelete={() => {
          handleDelete();
          closeDeleteModal();
        }}
      >
        <Text variant="medium" color={'foreground'}>
          You are about to delete
          <Text variant="medium" color={'foreground'} isBold as="span">
            {technicianToDelete !== undefined
              ? ` ${technicians[0].fullName} `
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
