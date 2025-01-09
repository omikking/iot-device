'use client';
import { useState } from 'react';
import {
  Badge,
  ColumnDef,
  DataTable,
  TableHeadWithSorting,
  Text,
} from '@gsp/ui';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { AdministratorSchema, administratorsMock } from '@/app/mock/mock';
import { LucideUserCog } from 'lucide-react';

type AdministratorsTableProps = {
  onOpenChange: (open: boolean) => void;
  onSelectAdministrator: (administrator: AdministratorSchema) => void;
};

export const AdministratorsTable = ({
  onOpenChange,
  onSelectAdministrator,
}: AdministratorsTableProps) => {
  const [administrators, setAdministrators] = useState(administratorsMock);
  const [isDeleteAdministratorModalOpen, setIsDeleteAdministratorModalOpen] =
    useState(false);
  const [administratorToDelete, setAdministratorToDelete] = useState<
    number | undefined
  >(undefined);

  const openDeleteModal = (index: number) => {
    setAdministratorToDelete(index);
    setIsDeleteAdministratorModalOpen(true);
  };

  const openEditModal = (index: number) => {
    const technicianToEdit = administrators[index];
    onSelectAdministrator(technicianToEdit);
    onOpenChange(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteAdministratorModalOpen(false);
    setAdministratorToDelete(undefined);
  };

  const handleDelete = (index: number) => {
    setAdministrators((currentAdministrators) =>
      currentAdministrators.filter((_, i) => i !== index),
    );
  };

  const columns: ColumnDef<AdministratorSchema>[] = [
    {
      accessorKey: 'fullName',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Name" />
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
      accessorKey: 'company',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Company" />
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <>
          {/* TODO find a better solution */}
          {row.getValue('role') === 'Sandvik admin' ? (
            <Badge variant="primary">
              <LucideUserCog />
              Sandvik admin
            </Badge>
          ) : (
            <Badge variant="attention">
              <LucideUserCog />
              Supah admin
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
        const rowIndex = administrators.findIndex(
          (admin) => admin.id === row.original.id,
        );

        return (
          <DeleteEditDropdown
            itemSelected={rowIndex}
            openDeleteModal={openDeleteModal}
            handleEdit={() => openEditModal(rowIndex)}
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
        modalTitle="Delete administrator"
        isOpen={isDeleteAdministratorModalOpen}
        itemToDelete={administratorToDelete}
        onOpenChange={closeDeleteModal}
        onDelete={(event, index) => {
          handleDelete(index);
          closeDeleteModal();
        }}
      >
        <Text variant="medium" color={'foreground'}>
          You are about to delete
          <Text variant="medium" color={'foreground'} isBold as="span">
            {administratorToDelete !== undefined
              ? ` ${administrators[administratorToDelete].fullName} `
              : ''}
          </Text>
          from the list. Are you sure you want to delete?
        </Text>
      </DeleteModalConfirmation>

      <DataTable
        columns={columns}
        data={administrators}
        noResultMessage="There are no administrators added yet."
      />
      <Badge variant="neutral" className="self-start">
        {administrators.length} total
      </Badge>
    </>
  );
};
