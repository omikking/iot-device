'use client';
import Link from 'next/link';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { useClient } from 'urql';
import { Site } from '@/gql/graphql';
import type { ColumnDef } from '@gsp/ui';
import { useCallback, useState } from 'react';
import { LucideMoveRight } from 'lucide-react';
import { DeleteEditDropdown } from '@/components/DeleteEditDropdown';
import { Text, Badge, Button, DataTable, TableHeadWithSorting } from '@gsp/ui';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';

type SitesTableProps = {
  companyId: string;
  onOpenChange: (isOpen: boolean) => void;
  onSelectSite: (site?: Site) => void;
};

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

export const SitesTable = ({
  companyId,
  onOpenChange,
  onSelectSite,
}: SitesTableProps) => {
  const [sitesData] = useQuery({
    query: getCompanySitesQuery,
    variables: { id: companyId || '' },
  });
  const sites = (sitesData.data?.company.sites as Site[]) || [];
  const [isDeleteSiteModalOpen, setDeleteSiteModalOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const client = useClient();

  const openDeleteModal = (siteId: string) => {
    const siteToDelete = sites?.find((site) => site.id === siteId);
    setSiteToDelete(siteToDelete);
    setDeleteSiteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteSiteModalOpen(false);
    setSiteToDelete(undefined);
  };

  const handleDelete = useCallback(async (): Promise<boolean> => {
    // Why is this not working?
    // const siteToDeleteObj = sites.find((site) => site.id === siteToDelete?.id);
    // const siteToDelete =    siteToDeleteObj?.id;
    const siteObj = sites.find((site) => site.id === siteToDelete?.id);
    const siteId = siteObj?.id;

    setIsDeleting(true);
    try {
      const result = await client
        .mutation(deleteSiteMutation, {
          id: siteId || '',
        })
        .toPromise();
      if (result.error) {
        return false;
      }
      return true;
    } catch (error) {
      //TODO error toast
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [siteToDelete, sites, client]);

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
        return (
          <Button variant="outline" size="small" asChild>
            <Link
              href={{
                pathname: `/sitelocations/${companyId}`,
                query: { siteId: row.original.id },
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
          deleteIcon="Site"
          modalTitle="Delete site"
          deleteButtonText="Delete site"
          isLoading={isDeleting}
          isOpen={isDeleteSiteModalOpen}
          onOpenChange={closeDeleteModal}
          onDelete={handleDelete}
          onClose={closeDeleteModal}
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
