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
import { LucideUserCog } from 'lucide-react';
import { GetAdminsQuery } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useMutation, useQuery } from 'urql';
import { useSession } from 'next-auth/react';

type Administrator = GetAdminsQuery['users'][0];

type AdministratorsTableProps = {
  onOpenChange: (open: boolean) => void;
  onSelectAdministrator: (administrator?: Administrator) => void;
};

const getAdminsQuery = graphql(`
  query getAdmins {
    users(roles: "SANDVIK_ADMIN") {
      id
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

export const AdministratorsTable = ({
  onOpenChange,
  onSelectAdministrator,
}: AdministratorsTableProps) => {
  const { data: session } = useSession();
  const [{ data: administratorsData }] = useQuery({
    query: getAdminsQuery,
    pause: !session?.company?.id,
  });

  const administrators =
    (administratorsData?.users as GetAdminsQuery['users']) || [];

  const [isDeleteAdministratorModalOpen, setIsDeleteAdministratorModalOpen] =
    useState(false);

  const [administratorToDelete, setAdministratorToDelete] = useState<
    Administrator | undefined
  >(undefined);
  const [, deleteAdmin] = useMutation(deleteAdminMutation);

  const openDeleteModal = (adminId: string) => {
    const adminToDelete = administrators?.find((admin) => admin.id === adminId);
    setAdministratorToDelete(adminToDelete);
    setIsDeleteAdministratorModalOpen(true);
  };

  const openEditModal = (adminId: string) => {
    const adminToEdit = administrators?.find((admin) => admin.id === adminId);
    if (adminToEdit) {
      onSelectAdministrator(adminToEdit);
      onOpenChange(true);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteAdministratorModalOpen(false);
    setAdministratorToDelete(undefined);
  };

  const handleDelete = () => {
    if (administratorToDelete) {
      deleteAdmin({
        id: administratorToDelete.id,
      }).then(() => {
        closeDeleteModal();
      });
    }
  };

  const columns: ColumnDef<Administrator>[] = [
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
      cell: () => (
        <>
          <Badge variant="primary">
            <LucideUserCog />
            Sandvik admin
          </Badge>
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
      {administratorToDelete && (
        <DeleteModalConfirmation
          deleteButtonText="Confirm deletion"
          deleteIcon="User"
          modalTitle="Delete administrator"
          isOpen={isDeleteAdministratorModalOpen}
          onOpenChange={closeDeleteModal}
          onDelete={handleDelete}
        >
          <Text variant="medium" color={'foreground'}>
            You are about to delete
            <Text variant="medium" color={'foreground'} isBold as="span">
              {` ${administratorToDelete?.fullName} `}
            </Text>
            from the list. Are you sure you want to delete?
          </Text>
        </DeleteModalConfirmation>
      )}

      <DataTable
        columns={columns}
        data={administrators}
        noResultMessage="There are no administrators added yet."
      />
      {administrators?.length > 0 && (
        <Badge variant="neutral" className="self-start">
          {administrators.length} total
        </Badge>
      )}
    </>
  );
};
