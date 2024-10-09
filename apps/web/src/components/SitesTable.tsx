'use client';
import { Text, Badge, Button, DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';
import { siteResultMock, SiteResultSchema } from '@/app/mock/mock';
import { LucideEllipsis, LucideMoveRight } from 'lucide-react';

export const SitesTable = () => {
  const columns: ColumnDef<SiteResultSchema>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Name" />
      ),
    },
    {
      accessorKey: 'adress',
      header: 'Adress',
    },
    {
      accessorKey: 'totalSiteLocations',
      header: 'Total site locations',
      cell: ({ row }) => {
        // TODO: send user to siteLocations with the siteName
        return (
          <Button variant="outline" size="small">
            <LucideMoveRight />
            <Text variant={'medium'} color={'foreground'}>
              {row.getValue('totalSiteLocations')}
            </Text>
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
      accessorKey: 'siteNumber',
      header: '',
      cell: () => {
        {
          /* @TODO: a popover with edit and delete options?? */
        }
        return (
          <Button variant="outline" size="small">
            <LucideEllipsis />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      {/* @TODO  
          next feature link total site locations with sitelocations page and give it the props of the site
          and also add a popover with edit and delete options
    */}
      <DataTable columns={columns} data={siteResultMock} />
      <Badge variant="neutral" className="self-start mt-5">
        {siteResultMock.length} total
      </Badge>
    </>
  );
};
