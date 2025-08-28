'use client';

import { DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';

export type MultiBoltReading = {
  reading: string;
  peakLoad: string;
  peakDisplacement: string;
};

type MultiBoltReadingTableProps = {
  peakLoad: number[];
  peakDisplacement: number[];
};

const columns: ColumnDef<MultiBoltReading>[] = [
  {
    accessorKey: 'reading',
    header: 'Reading',
  },
  {
    accessorKey: 'peakLoad',
    header: ({ column }) => (
      <TableHeadWithSorting column={column} header="Peak load (tons)" />
    ),
  },

  {
    accessorKey: 'peakDisplacement',
    header: ({ column }) => (
      <TableHeadWithSorting column={column} header="Peak displacement (mm)" />
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
  const multiReadingResults = peakLoad.map((value, i) => ({
    reading: (i + 1).toString(),
    peakLoad: peakLoad[i]?.toString(),
    peakDisplacement: peakDisplacement[i]?.toString(),
  }));
  return (
    <div>
      <DataTable
        columns={columns}
        data={multiReadingResults || []}
        variant="noBorder"
        className="!p-0 !pt-5"
      />
    </div>
  );
};
