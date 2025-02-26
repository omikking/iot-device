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
// import { AdministratorSchema, administratorsMock } from '@/app/mock/mock';
import { LucideUserCog } from 'lucide-react';
import { useAdmins } from '@/components/urql-administrator/AdministratorFetchUrql';

// export interface AdministratorSchema {
//   id: string;
//   fullName: string;
//   email: string;
//   company: string;
//   phoneNumber: string;
//   role: string;
// }

type IUser = {
  id: string;
  email: string;
  fullName: string;
  workPlace: string;
  phoneNumber: string;
  globalRole: boolean;
  isGlobalVisibility: boolean;
  userPermissions: UserPermission[];
};

type UserPermission = {
  id: string;
  userId: string;
  role:
    | 'COMPANY_USER'
    | 'COMPANY_ADMIN'
    | 'SANDVIK_TECHNICIAN'
    | 'SANDVIK_ADMIN';
  appsAccess: string[];
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

  // const getUserPermissions = (
  //   permissions: UserPermission[],
  // ): UserPermission => {
  //   const defaultPermission: UserPermission = {
  //     id: '',
  //     userId: '',
  //     role: 'COMPANY_USER',
  //     appsAccess: [],
  //   };

  //   return permissions[0] || defaultPermission;
  // };

  // const getBadge = (
  //   role: UserPermission['role'],
  // ): {
  //   variant: 'neutral' | 'primary';
  //   icon: React.ReactNode;
  // } => {
  //   switch (role) {
  //     case 'COMPANY_ADMIN':
  //       return { variant: 'primary', icon: <LucideKey /> };
  //     case 'SANDVIK_ADMIN':
  //       return { variant: 'primary', icon: <LucideKey /> };
  //     default:
  //       return { variant: 'neutral', icon: <LucideUserCog /> };
  //   }
  // };

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
    // setAdministrators((currentAdministrators) =>
    //   currentAdministrators.filter((_, i) => i !== index),
    // );
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
