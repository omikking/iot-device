'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { ColumnDef } from '@gsp/ui';
import { LucideMoveRight } from 'lucide-react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { Text, Badge, Button, DataTable, TableHeadWithSorting } from '@gsp/ui';
import { Site } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useMutation, useQuery } from 'urql';
import { useSession } from 'next-auth/react';

const getCompanySitesQuery = graphql(`
  query getCompanySites($id: String!) {
    company(id: $id) {
      sites {
        id
        siteName
        address
        city
        country
        postalCode
        companyId
      }
    }
  }
`);

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
  onOpenChange: (isOpen: boolean) => void;
  onSelectSite: (site?: Site) => void;
};

export const SitesTable = ({ onOpenChange, onSelectSite }: SitesTableProps) => {
  const { data: session } = useSession();

  const [sitesData] = useQuery({
    query: getCompanySitesQuery,
    variables: { id: session?.company?.id || '' },
    pause: !session?.company?.id,
  });
  const sites = (sitesData.data?.company.sites as Site[]) || [];

  const [isDeleteSiteModalOpen, setDeleteSiteModalOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | undefined>(undefined);
  const [, deleteSite] = useMutation(deleteSiteMutation);

  const openDeleteModal = (siteId: string) => {
    const siteToDelete = sites?.find((site) => site.id === siteId);
    setSiteToDelete(siteToDelete);
    setDeleteSiteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteSiteModalOpen(false);
    setSiteToDelete(undefined);
  };

  const handleDelete = () => {
    if (siteToDelete) {
      deleteSite({
        id: siteToDelete.id,
      }).then(() => {
        closeDeleteModal();
      });
    }
  };

  const openEditModal = (siteId: string) => {
    const siteToEdit = sites?.find((site) => site.id === siteId);
    onSelectSite(siteToEdit);
    onOpenChange(true);
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
        return (
          <Button variant="outline" size="small" asChild>
            <Link
              href={{
                pathname: `/sitelocations/${row.original.id}`,
              }}
            >
              <LucideMoveRight />
              <Text variant={'medium'} color={'foreground'}>
                {row.getValue('totalSiteLocations')} Site locations
              </Text>
            </Link>
          </Button>
        );
      },
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'city',
      header: 'City',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
    {
      accessorKey: 'postalCode',
      header: 'Postal code',
    },
    {
      accessorKey: 'settings',
      header: '',
      cell: ({ row }) => {
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
      {siteToDelete && (
        <DeleteModalConfirmation
          deleteButtonText="Delete site"
          deleteIcon="Site"
          modalTitle="Delete site"
          isOpen={isDeleteSiteModalOpen}
          onOpenChange={closeDeleteModal}
          onDelete={handleDelete}
        >
          <Text variant="medium" color={'foreground'}>
            You are about to delete
            <Text variant="medium" color={'foreground'} isBold as="span">
              {` ${siteToDelete.siteName} `}
            </Text>
            from the list. Are you sure you want to delete?
          </Text>
        </DeleteModalConfirmation>
      )}

      <DataTable
        columns={columns}
        data={sites}
        noResultMessage="There are no sites added yet."
      />
      {sites?.length > 0 && (
        <Badge variant="neutral" className="self-start mt-5">
          {sites.length} total
        </Badge>
      )}
    </>
  );
};
