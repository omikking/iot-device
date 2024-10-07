'use client';

import { MultiBoltReadingSchema as MultiBoltReadingSchema } from '@/app/mock/mock';
import { Badge, DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';

interface MultiBoltReadingTableProps {
  boltResults: MultiBoltReadingSchema[] | undefined;
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
      <div style={{ fontWeight: 'bold' }}>
        <TableHeadWithSorting column={column} header="Peak displacement" />
      </div>
    ),
    // cell: ({ column }) => <div className="bg-black">{column}</div>,
  },
  {
    accessorKey: ' ',
    header: ' ',
  },
];

export const MultiBoltReadingTable = ({
  boltResults,
}: MultiBoltReadingTableProps) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={boltResults || []}
        variant="noBorder"
        className="!p-0 !pt-5"
      />

      <Badge variant="neutral" className="self-start mt-5">
        {boltResults?.length} total
      </Badge>
    </div>
  );
};
