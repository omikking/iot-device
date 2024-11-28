'use client';
import { Text, Badge, Button, DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';
import { siteResultMock, SiteResultSchema } from '@/app/mock/mock';
import { LucideMoveRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';

export const SitesTable = () => {
  const [sites, setSites] = useState(siteResultMock);
  const [isDeleteSiteModalOpen, setIsDeleteSiteModalOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<number | undefined>(
    undefined,
  );

  const openDeleteModal = (index: number) => {
    setSiteToDelete(index);
    setIsDeleteSiteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteSiteModalOpen(false);
    setSiteToDelete(undefined);
  };

  const handleDelete = (index: number) => {
    setSites((currentSites) => currentSites.filter((item, i) => i !== index));
  };

  const columns: ColumnDef<SiteResultSchema>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Name" />
      ),
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'totalSiteLocations',
      header: 'Total site locations',
      cell: ({ row }) => {
        return (
          <Button variant="outline" size="small" asChild>
            <Link
              href={{
                pathname: '/sitelocations',
                query: { data: `${row.original.name} site` },
              }}
            >
              <LucideMoveRight />
              <Text variant={'medium'} color={'foreground'}>
                {row.getValue('totalSiteLocations')} site locations
              </Text>
            </Link>
          </Button>
        );
      },
    },
    {
      accessorKey: 'passCriteria',
      header: 'Pass criteria',
    },
    {
      accessorKey: 'notification',
      header: 'Notification',
    },
    {
      accessorKey: 'settings',
      header: '',
      cell: ({ row }) => {
        const rowIndex = sites.findIndex((site) => site.id === row.original.id);
        return (
          <>
            <DeleteEditDropdown
              itemToDelete={rowIndex}
              openDeleteModal={openDeleteModal}
              handleEdit={() => console.log('Edit')}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <DeleteModalConfirmation
        deleteButtonText="Confirm deletion"
        deleteIcon="User"
        modalTitle="Delete user"
        isOpen={isDeleteSiteModalOpen}
        itemToDelete={siteToDelete}
        onOpenChange={closeDeleteModal}
        onDelete={(event, index) => {
          handleDelete(index);
          closeDeleteModal();
        }}
      >
        <Text variant="medium" color={'foreground'}>
          You are about to delete
          <Text variant="medium" color={'foreground'} isBold as="span">
            {siteToDelete && ` ${sites[siteToDelete].name} `}
          </Text>
          from the list. Are you sure you want to delete?
        </Text>
      </DeleteModalConfirmation>

      <DataTable
        columns={columns}
        data={sites}
        noResultMessage="There are no sites added yet."
      />
      {sites.length && (
        <Badge variant="neutral" className="self-start mt-5">
          {sites.length} total
        </Badge>
      )}
    </>
  );
};
