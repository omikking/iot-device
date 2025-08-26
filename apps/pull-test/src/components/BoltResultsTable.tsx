'use client';
import type { ColumnDef } from '@gsp/ui';
import { MultiReadBadge } from './MultiReadBadge';
import { Badge, DataTable, TableHeadWithSorting } from '@gsp/ui';
import {
  LucideCheckCircle,
  LucideXCircle,
  LucideSearchX,
  ClipboardList,
} from 'lucide-react';
import { BoltResult, Result, RingPosition } from '@/gql/graphql';
import { BoltCommentBadge } from './BoltCommentBadge';
import { Pagination } from './Pagination';
import { convertRingPosition } from '@/libs/utils';

type BoltResultsTableProps = {
  boltResults?: BoltResult[];
  site?: string;
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

const getBadge = (
  result: Result.Abort | Result.Pass | Result.Fail,
): {
  variant: 'success' | 'destructive' | 'warning';
  icon: React.ReactNode;
} => {
  switch (result) {
    case Result.Pass:
      return { variant: 'success', icon: <LucideCheckCircle /> };
    case Result.Fail:
      return { variant: 'destructive', icon: <LucideXCircle /> };
    case Result.Abort:
      return { variant: 'warning', icon: <LucideSearchX /> };
  }
};

export const BoltResultsTable = ({
  boltResults,
  site,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}: BoltResultsTableProps) => {
  const columns: ColumnDef<BoltResult>[] = [
    {
      accessorKey: 'boltNumber',
      meta: { headerClassName: 'w-36' },
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Bolt" />
      ),
    },
    {
      accessorKey: 'boltType',
      header: 'Bolt type',
    },
    {
      accessorKey: 'peakLoad',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Peak load(tons)" />
      ),
      cell: ({ row }) => {
        const { peakLoad } = row.original;
        if (peakLoad.length > 1) {
          return <MultiReadBadge boltResult={row.original} />;
        }
        if (peakLoad.length === 1) {
          return peakLoad[0];
        }
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.getValue('peakLoad') as string[];
        const b = rowB.getValue('peakLoad') as string[];

        if (a.length > 1 && b.length <= 1) return 1;
        if (b.length > 1 && a.length <= 1) return -1;
        if (a.length > 1 && b.length > 1) return 0;

        const aNum = Number(a[0]);
        const bNum = Number(b[0]);

        return aNum < bNum ? -1 : 1;
      },
    },
    {
      accessorKey: 'peakDisplacement',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Peak displacement(mm)" />
      ),
      cell: ({ row }) => {
        const { peakDisplacement } = row.original;
        if (peakDisplacement.length > 1) {
          return <MultiReadBadge boltResult={row.original} />;
        }
        if (peakDisplacement.length === 1) {
          return peakDisplacement[0];
        }
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.getValue('peakDisplacement') as string[];
        const b = rowB.getValue('peakDisplacement') as string[];

        if (a.length > 1 && b.length <= 1) return 1;
        if (b.length > 1 && a.length <= 1) return -1;
        if (a.length > 1 && b.length > 1) return 0;

        const aNum = Number(a[0]);
        const bNum = Number(b[0]);

        return aNum < bNum ? -1 : 1;
      },
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => row.original.level?.levelName,
    },
    {
      accessorKey: 'drive',
      header: 'Drive',
      cell: ({ row }) => row.original.drive?.driveName,
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.location?.locationName,
    },
    {
      accessorKey: 'positionInRing',
      header: 'Position in ring',
      cell: ({ row }) =>
        convertRingPosition(row.original.positionInRing as RingPosition),
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: ({ row }) => {
        return <BoltCommentBadge boltResult={row.original} />;
      },
    },
    {
      accessorKey: 'result',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Result" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-end w-16">
          <Badge variant={getBadge(row?.getValue('result'))?.variant}>
            {getBadge(row?.getValue('result'))?.icon}
            {row.getValue('result')}
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={boltResults || []}
        noResultMessage={
          !site
            ? 'Select site to view bolt results.'
            : 'There are no bolt results found for your search.'
        }
        icon={
          !site ? (
            <ClipboardList color="gray" />
          ) : (
            <LucideSearchX color="gray" />
          )
        }
      />
      {!!boltResults?.length && boltResults?.length > 0 && totalCount && (
        <div className="flex justify-between">
          <Badge variant="neutral" className="self-start mt-5">
            {totalCount} total
          </Badge>

          <Pagination
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
};
