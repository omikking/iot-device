'use client';

import { MultiBoltReadingSchema } from '@/app/mock/mock';
import { Badge, DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';

interface MultiBoltReadingTableProps {
  multiReadingResults?: MultiBoltReadingSchema[];
  site?: string;
}

const columns: ColumnDef<MultiBoltReadingSchema>[] = [
  {
    accessorKey: 'reading',
    header: 'Reading',
  },
  {
    accessorKey: 'peakLoad',
    header: ({ column }) => (
      <TableHeadWithSorting column={column} header="Peak load" />
    ),
  },

  {
    accessorKey: 'peakDisplacement',
    header: ({ column }) => (
      <div>
        <TableHeadWithSorting column={column} header="Peak displacement" />
      </div>
    ),
  },
  {
    accessorKey: ' ',
    header: ' ',
  },
];

export const MultiBoltReadingTable = ({
  multiReadingResults,
}: MultiBoltReadingTableProps) => {
  return (
    <div>
      {/* @TODO fix the important "!" modifier */}
      <DataTable
        columns={columns}
        data={multiReadingResults || []}
        variant="noBorder"
        className="!p-0 !pt-5"
      />
      {multiReadingResults?.length && (
        <Badge variant="neutral" className="self-start mt-5">
          {multiReadingResults?.length} total
        </Badge>
      )}
    </div>
  );
};
