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
import { useMutation, useQuery } from 'urql';
import { LucideUserCog } from 'lucide-react';
import { GetAdminsQuery } from '@/gql/graphql';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { responses } from '@/app/uitexts/responses';
import { GraphQLErrorExtensions } from '@/libs/utils';

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
  const [, deleteAdmin] = useMutation(deleteAdminMutation);

  const openDeleteModal = (adminId: string) => {
    const adminToDelete = administrators?.find((admin) => admin.id === adminId);
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
                title: responses.adminDeleteSuccess,
                variant: 'success',
              });
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
