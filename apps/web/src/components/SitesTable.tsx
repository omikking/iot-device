'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { ColumnDef } from '@gsp/ui';
import { LucideMoveRight } from 'lucide-react';
import { DeleteEditDropdown } from './DeleteEditDropdown';
import { siteResultMock, SiteResultSchema } from '@/app/mock/mock';
import { DeleteModalConfirmation } from './DeleteModalConfirmation';
import { Text, Badge, Button, DataTable, TableHeadWithSorting } from '@gsp/ui';

type SitesTableProps = {
  onOpenChange: (isOpen: boolean) => void;
  onSelectSite: (site: SiteResultSchema) => void;
};

export const SitesTable = ({ onOpenChange, onSelectSite }: SitesTableProps) => {
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

  const openEditModal = (index: number) => {
    const siteToEdit = sites[index];
    onSelectSite(siteToEdit);
    onOpenChange(true);
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
              itemSelected={rowIndex}
              openDeleteModal={openDeleteModal}
              handleEdit={openEditModal}
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
