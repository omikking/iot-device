'use client';

import { MultiBoltReadingSchema } from '@/app/mock/mock';
import { Badge, DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';

interface MultiBoltReadingTableProps {
  peakLoad: string[];
  peakDisplacement: string[];
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
      <TableHeadWithSorting column={column} header="Peak displacement" />
    ),
  },
  {
    accessorKey: ' ',
    header: ' ',
  },
];

export const MultiBoltReadingTable = ({
  peakLoad,
  peakDisplacement,
}: MultiBoltReadingTableProps) => {
  const multiReadingResult = peakLoad.map((value, i) => ({
    reading: (i + 1).toString(),
    peakLoad: peakLoad[i]?.toString(),
    peakDisplacement: peakDisplacement[i]?.toString(),
  }));

  return (
    <div>
      {/* @TODO fix the important "!" modifier */}
      <DataTable
        columns={columns}
        data={multiReadingResult || []}
        variant="noBorder"
        className="!p-0 !pt-5"
      />
      {multiReadingResult?.length && (
        <Badge variant="neutral" className="self-start mt-5">
          {multiReadingResult?.length} total
        </Badge>
      )}
    </div>
  );
};
