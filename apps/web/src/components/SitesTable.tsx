'use client';
import { Text, Badge, Button, DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';
import { siteResultMock, SiteResultSchema } from '@/app/mock/mock';
import { LucideEllipsis, LucideMoveRight } from 'lucide-react';
import Link from 'next/link';

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
      <DataTable
        columns={columns}
        data={siteResultMock}
        noResultMessage="There are no sites added yet."
      />
      {siteResultMock.length && (
        <Badge variant="neutral" className="self-start mt-5">
          {siteResultMock.length} total
        </Badge>
      )}
    </>
  );
};
