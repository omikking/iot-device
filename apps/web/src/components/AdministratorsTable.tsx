'use client';
import {
  Badge,
  ColumnDef,
  DataTable,
  TableHeadWithSorting,
  Text,
} from '@gsp/ui';
import { useState } from 'react';
import { LucideUserCog } from 'lucide-react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { useAdmins } from '@/components/urql-administrator/AdministratorFetchUrql';
import { AdministratorDeleteUrql } from '@/components/urql-administrator/AdministratorDeleteUrql';

type IUser = {
  id: string;
  email: string;
  fullName: string;
  workPlace: string;
  phoneNumber: string;
  globalRole: boolean;
};

type AdministratorsTableProps = {
  onOpenChange: (open: boolean) => void;
  onSelectAdministrator: (administrator: IUser) => void;
};

export const AdministratorsTable = ({
  onOpenChange,
  onSelectAdministrator,
}: AdministratorsTableProps) => {
  // const [administrators, setAdministrators] = useState(administratorsMock);
  const [isDeleteAdministratorModalOpen, setIsDeleteAdministratorModalOpen] =
    useState(false);
  const [administratorToDelete, setAdministratorToDelete] = useState<
    number | undefined
  >(undefined);

  const { administrators } = useAdmins(['SANDVIK_ADMIN']);
  const { removeUser } = AdministratorDeleteUrql();

  const openDeleteModal = (index: number) => {
    setAdministratorToDelete(index);
    setIsDeleteAdministratorModalOpen(true);
  };

  const openEditModal = (index: number) => {
    const adminToEdit = administrators[index];
    onSelectAdministrator(adminToEdit);
    onOpenChange(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteAdministratorModalOpen(false);
    setAdministratorToDelete(undefined);
  };

  const handleDelete = (index: number) => {
    // Unable to remove due to foreign key constraint
    removeUser(administrators[index].id);
  };

  const columns: ColumnDef<IUser>[] = [
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
      accessorKey: 'workPlace',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Company" />
      ),
    },
    {
      accessorKey: 'globalRole',
      header: 'Role',
      cell: ({ row }) => {
        if (row.original.globalRole) {
          return (
            <Badge variant="primary">
              <LucideUserCog />
              Sandvik admin
            </Badge>
          );
        }
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
