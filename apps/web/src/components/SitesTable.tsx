'use client';
import {
  Text,
  Badge,
  Button,
  DataTable,
  showAlertToast,
  TableHeadWithSorting,
} from '@gsp/ui';
import { graphql } from '@/gql';
import { useState } from 'react';
import { useMutation } from 'urql';
import { Role, Site } from '@/gql/graphql';
import type { ColumnDef } from '@gsp/ui';
import { responses } from '@/app/uitexts/responses';
import { handleGraphQLErrors, isCompanyAdmin } from '@/libs/utils';
import { LucideMoveRight, LucideSearchX } from 'lucide-react';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { useSession } from 'next-auth/react';
import { CellContext } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';

const deleteSiteMutation = graphql(`
  mutation deleteSite($id: String!) {
    removeSite(id: $id) {
      id
      siteName
      address
      city
      country
      postalCode
      companyId
    }
  }
`);

type SitesTableProps = {
  sites: Site[];
  onSelectSite: (site?: Site) => void;
  onOpenChange: (isOpen: boolean) => void;
};

export const SitesTable = ({
  sites,
  onOpenChange,
  onSelectSite,
}: SitesTableProps) => {
  const params = useParams();
  const companyId = params.id as string;
  const router = useRouter();

  const { data: session } = useSession();
  const isUserSandvikAdmin = session?.user?.globalRole === Role.SandvikAdmin;
  const isUserCompanyAdmin = isCompanyAdmin(
    session?.user?.userPermissions,
    companyId,
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteSiteModalOpen, setDeleteSiteModalOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | undefined>(undefined);
  const [, deleteSite] = useMutation(deleteSiteMutation);

  const openDeleteModal = (siteId: string) => {
    const foundSite = sites?.find((site) => site.id === siteId);
    setSiteToDelete(foundSite);
    setDeleteSiteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteSiteModalOpen(false);
    setSiteToDelete(undefined);
  };

  const handleDelete = async (): Promise<boolean> => {
    if (!siteToDelete?.id) {
      return false;
    }

    setIsDeleting(true);

    return (
      deleteSite({ id: siteToDelete.id })
        .then((result) => {
          // Backend errors
          const hasGraphQLErrors = handleGraphQLErrors(result.error);
          if (hasGraphQLErrors) {
            return false;
          }
          // Success
          if (result.data) {
            setTimeout(() => {
              showAlertToast({
                title: responses.siteDeleteSuccess,
                variant: 'info',
              });
            }, 1500);
          }
          return true;
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.siteDeleteFailed,
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

  const openEditModal = (siteId: string) => {
    const siteToEdit = sites?.find((site) => site.id === siteId);
    if (siteToEdit) {
      onSelectSite(siteToEdit);
      onOpenChange(true);
    }
  };

  const columns: ColumnDef<Site>[] = [
    {
      accessorKey: 'siteName',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Site name" />
      ),
    },
    {
      accessorKey: 'totalSiteLocations',
      header: 'Site locations',
      cell: ({ row }) => {
        const handleClick = () => {
          router.push(`/site-locations/${companyId}?siteId=${row.original.id}`);
        };
        return (
          <Button variant="outline" size="small" onClick={handleClick}>
            <LucideMoveRight />
            <Text variant="medium" color="foreground">
              Site locations
            </Text>
          </Button>
        );
      },
    },
    {
      accessorKey: 'fullAddress',
      header: 'Address',
      cell: ({ row }) => {
        const { address, city, postalCode, country } = row.original;
        return (
          <Text variant="medium" color="foreground">
            {address}, {city} {postalCode}, {country}
          </Text>
        );
      },
    },
    {
      accessorKey: 'settings',
      header: '',
      cell: ({ row }: CellContext<Site, unknown>) => {
        if (!isUserSandvikAdmin && !isUserCompanyAdmin) {
          return null;
        }
        const site = sites.find((site) => site.id === row.original.id);
        return (
          site && (
            <DeleteEditDropdown
              itemSelected={site.id}
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
        deleteIcon="Site"
        modalTitle="Delete site"
        modalDeleteButtonText="Delete site"
        isLoading={isDeleting}
        isOpen={isDeleteSiteModalOpen}
        onDelete={handleDelete}
        onClose={closeDeleteModal}
        onOpenChange={closeDeleteModal}
      >
        <Text variant="medium" color={'foreground'}>
          Are you sure you want to permanently remove
          <Text variant="medium" color={'foreground'} isBold as="span">
            {` ${siteToDelete?.siteName} `}
          </Text>
          from the list?
        </Text>
      </DeleteModalConfirmation>

      <DataTable
        columns={columns}
        data={sites}
        noResultMessage="There are no sites added yet."
        icon={<LucideSearchX className="text-neutral-5" />}
      />
      {sites?.length > 0 && (
        <Badge variant="neutral" className="self-start mt-5">
          {sites.length} total
        </Badge>
      )}
    </>
  );
};
