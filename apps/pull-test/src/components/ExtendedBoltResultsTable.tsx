'use client';

import { BoltMultiReadingSchema } from '@/app/mock/mock';
import { Badge, DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';

interface ExtendedBoltResultsTableProps {
  boltResults: BoltMultiReadingSchema[] | undefined;
  site?: string;
}

// const foo: ColumnDef<BoltResultSchema> = {}
const columns: ColumnDef<BoltMultiReadingSchema>[] = [
  {
    accessorKey: 'reading',
    header: ({ column }) => (
      // TODO: REMOVE SORTING
      <TableHeadWithSorting column={column} header="Reading" />
    ),
  },

  {
    accessorKey: 'peakLoad',
    header: ({ column }) => (
      <TableHeadWithSorting column={column} header="Peak load" />
    ),
  },
  // Add sort
  {
    accessorKey: 'peakDisplacement',
    header: 'Peak displacement',
  },
];

export const ExtendedBoltResultsTable = ({
  boltResults,
}: ExtendedBoltResultsTableProps) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={boltResults || []}
        variant="noBorder"
        className="!p-0 !pt-5"
      />

      <Badge variant="neutral" className="self-start mt-5">
        {boltResults?.length} totales
      </Badge>
    </div>
  );
};
