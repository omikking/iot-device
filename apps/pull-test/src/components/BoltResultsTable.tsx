'use client';
import { BoltResultSchema } from '@/app/mock/mock';
import { Badge, DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';
import {
  LucideCheckCircle,
  LucideOctagonAlert,
  LucideSearchX,
} from 'lucide-react';
import { MultiReadBadge } from './MultiReadBadge';
import { MultiBoltDetailsModal } from './MultiBoltDetailsModal';

interface BoltResultsTableProps {
  boltResults: BoltResultSchema[] | undefined;
  site?: string;
}

interface RowData {
  original: BoltResultSchema;
}

interface BoltSpecification {
  title: string;
  text: string;
}

const getResultBadge = (result: 'Pass' | 'Fail' | 'Abort') => {
  switch (result) {
    case 'Pass':
      return { variant: 'success', icon: <LucideCheckCircle /> };
    case 'Fail':
      return { variant: 'destructive', icon: <LucideOctagonAlert /> };
    case 'Abort':
      return { variant: 'warning', icon: <LucideSearchX /> };
  }
};

const transformRowToSpecifications = (row: RowData): BoltSpecification[] => {
  return [
    { title: 'Displacement', text: row.original.peakDisplacement.toString() },
    { title: 'Bit size', text: row.original.bitSize },
    { title: 'Pass criteria', text: row.original.boltType },
    { title: 'Rotations', text: row.original.rotations },
    { title: 'Level', text: row.original.level },
    { title: 'Peak load', text: row.original.peakLoad.toString() },
  ];
};

const renderMultiReadBadge = (row: RowData, accessorKey: string) => {
  const { peakLoad, peakDisplacement } = row.original;
  if (peakLoad.length > 1 && peakDisplacement.length > 1) {
    const multiReadings = peakLoad.map((value, index) => ({
      reading: (index + 1).toString(),
      peakLoad: peakLoad[index]?.toString(),
      peakDisplacement: peakDisplacement[index]?.toString(),
    }));
    return MultiReadBadge(row, multiReadings, row.original.isHazard ?? false);
  }

  // AI generated code may need to adjust it
  return row.original[accessorKey as keyof BoltResultSchema];
};

export const BoltResultsTable = ({
  boltResults,
  site,
}: BoltResultsTableProps) => {
  const columns: ColumnDef<BoltResultSchema>[] = [
    {
      accessorKey: 'boltNumber',
      meta: { headerClassName: 'w-36' },
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
      cell: ({ row }) => renderMultiReadBadge(row, 'peakLoad'),
    },
    {
      accessorKey: 'peakDisplacement',
      header: 'Peak displacement',
      cell: ({ row }) => renderMultiReadBadge(row, 'peakDisplacement'),

      meta: { headerClassName: 'w-32' },
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
      cell: ({ row }) => {
        const { peakLoad, peakDisplacement } = row.original;
        const multiReadings = peakLoad.map((load, index) => ({
          reading: (index + 1).toString(),
          peakLoad: load.toString(),
          peakDisplacement: peakDisplacement[index]?.toString(),
        }));
        const boltSpec = transformRowToSpecifications(row);
        return (
          <MultiBoltDetailsModal
            row={row}
            isHazard={row.original.isHazard ?? false}
            boltSpec={boltSpec}
            multiReadings={multiReadings || []}
          />
        );
      },
    },
    {
      accessorKey: 'result',
      header: ({ column }) => (
        <div className="text-right w-16">
          <TableHeadWithSorting column={column} header="Result" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-end w-16">
          <Badge variant={getResultBadge(row.getValue('result')).variant}>
            {getResultBadge(row.getValue('result')).icon}
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
            : 'No bolt results found for your search.'
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
