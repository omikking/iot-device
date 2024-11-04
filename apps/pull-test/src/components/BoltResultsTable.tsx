'use client';

import { BoltResultSchema } from '@/app/mock/mock';
import { Badge, DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';
import {
  LucideCheckCircle,
  LucideOctagonAlert,
  LucideSearchX,
} from 'lucide-react';

interface BoltResultsTableProps {
  boltResults: BoltResultSchema[] | undefined;
  site?: string;
}

const getBadge = (
  result: 'Pass' | 'Fail' | 'Abort',
): {
  variant: 'success' | 'destructive' | 'warning';
  icon: React.ReactNode;
} => {
  switch (result) {
    case 'Pass':
      return { variant: 'success', icon: <LucideCheckCircle /> };
    case 'Fail':
      return { variant: 'destructive', icon: <LucideOctagonAlert /> };
    case 'Abort':
      return { variant: 'warning', icon: <LucideSearchX /> };
  }
};

const columns: ColumnDef<BoltResultSchema>[] = [
  {
    accessorKey: 'boltNumber',
    meta: {
      headerClassName: 'w-36',
    },
    header: ({ column }) => (
      <TableHeadWithSorting column={column} header="Bolt number" />
    ),
  },
  {
    accessorKey: 'boltType',
    header: ({ column }) => (
      <TableHeadWithSorting column={column} header="Bolt type" />
    ),
  },
  {
    accessorKey: 'peakLoad',
    header: 'Peak load',
  },
  {
    accessorKey: 'peakDisplacement',
    header: 'Peak displacement',
    meta: {
      headerClassName: 'w-32',
    },
  },
  {
    accessorKey: 'bitSize',
    header: 'Bit size',
  },
  {
    accessorKey: 'rotations',
    header: 'Rotations',
  },
  {
    accessorKey: 'displacementPerTonnage',
    header: 'Displacement per tonnage',
    meta: {
      headerClassName: 'w-32',
    },
  },
  {
    accessorKey: 'level',
    header: 'Level',
  },
  {
    accessorKey: 'drive',
    header: 'Drive',
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'ring',
    header: 'Ring',
  },
  {
    accessorKey: 'comment',
    header: 'Comment',
  },
  {
    accessorKey: 'result',
    header: ({ column }) => (
      <div className="text-right w-16">
        <TableHeadWithSorting column={column} header="Result" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-end w-16">
          <Badge variant={getBadge(row.getValue('result')).variant}>
            {getBadge(row.getValue('result')).icon}
            {row.getValue('result')}
          </Badge>
        </div>
      );
    },
  },
];

export const BoltResultsTable = ({
  boltResults,
  site,
}: BoltResultsTableProps) => {
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
      />
      {boltResults?.length && (
        <Badge variant="neutral" className="self-start mt-5">
          {boltResults?.length} total
        </Badge>
      )}
    </>
  );
};
