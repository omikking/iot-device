'use client';

import { BoltResultSchema } from '@/app/mock/mock';
import { Badge, DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';
import { useState } from 'react';

interface ExtendedBoltResultsTableProps {
  boltResults: BoltResultSchema[] | undefined;
  site?: string;
}

const columns: ColumnDef<BoltResultSchema>[] = [
  {
    accessorKey: 'reading',
    header: ({ column }) => (
      <TableHeadWithSorting column={column} header="Reading" />
    ),
    cell: ({ row }) => row.index + 1,
  },

  {
    accessorKey: 'peakLoad',
    header: ({ column }) => (
      <TableHeadWithSorting column={column} header="Peak load" />
    ),
  },
  {
    accessorKey: 'peakDisplacement',
    header: 'Peak displacement',
  },
];

export const ExtendedBoltResultsTable = ({
  boltResults,
}: ExtendedBoltResultsTableProps) => {
  const [selectedRow, setSelectedRow] = useState<BoltResultSchema | null>(null);
  // Filter the boltResults to include only those with peakLoad and peakDisplacement as arrays
  const filteredBoltResults = boltResults?.filter(
    (result) =>
      Array.isArray(result.peakLoad) || Array.isArray(result.peakDisplacement),
  );

  const handleRowClick = (row: BoltResultSchema) => {
    setSelectedRow(row);
  };

  const dataToDisplay = selectedRow ? [selectedRow] : filteredBoltResults || [];

  console.log(filteredBoltResults);
  console.log(boltResults);
  return (
    <div className="">
      <DataTable
        columns={columns}
        data={dataToDisplay}
        variant="noBorder"
        className="!p-0 !pt-5"
        onRowClick={handleRowClick}
      />

      <Badge variant="neutral" className="self-start mt-5">
        {dataToDisplay?.length} totales
      </Badge>
    </div>
  );
};
