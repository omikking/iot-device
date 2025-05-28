'use client';
import {
  Text,
  Badge,
  ColumnDef,
  DataTable,
  TableHeadWithSorting,
} from '@gsp/ui';
import { graphql } from '@/gql';
import { useClient, useQuery } from 'urql';
import { LucideUserCog } from 'lucide-react';
import { useCallback, useState } from 'react';
import { GetAdminsQuery } from '@/gql/graphql';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';

type Administrator = GetAdminsQuery['users'][0];

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

export const AdministratorsTable = () => {
  const [administratorsData] = useQuery({
    query: getAdminsQuery,
  });

  const administrators =
    (administratorsData?.data?.users as GetAdminsQuery['users']) || [];

  const [isDeleteAdministratorModalOpen, setIsDeleteAdministratorModalOpen] =
    useState(false);

  const [administratorToDelete, setAdministratorToDelete] = useState<
    Administrator | undefined
  >(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const client = useClient();

  const openDeleteModal = (adminId: string) => {
    const adminToDelete = administrators?.find((admin) => admin.id === adminId);
    setAdministratorToDelete(adminToDelete);
    setIsDeleteAdministratorModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteAdministratorModalOpen(false);
    setAdministratorToDelete(undefined);
  };

  const handleDelete = useCallback(async (): Promise<boolean> => {
    const adminFound = administrators.find(
      (admin) => admin.id === administratorToDelete?.id,
    );
    const adminId = adminFound?.id;

    setIsDeleting(true);
    try {
      const result = await client
        .mutation(deleteAdminMutation, {
          id: adminId || '',
        })
        .toPromise();
      if (result.error) {
        //TODO error toast
        return false;
      }

      return true;
    } catch (error) {
      //TODO error toast
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [administratorToDelete, administrators, client]);

  const columns: ColumnDef<Administrator>[] = [
    {
      accessorKey: 'fullName',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Full name" />
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
      {administratorToDelete && (
        <DeleteModalConfirmation
          deleteIcon="User"
          modalTitle="Delete administrator"
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
