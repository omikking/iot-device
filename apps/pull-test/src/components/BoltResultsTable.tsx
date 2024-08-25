'use client';

import { Badge, DataTable } from '@gsp/ui';
import { LucideCheckCircle } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

interface BoltResultSchema {
  id: string;
  boltNumber: string;
  boltType: string;
  peakLoad: string;
  peakDisplacement: string;
  bitSize: string;
  rotations: string;
  displacementPerTonnage: string;
  level: string;
  drive: string;
  position: string;
  ring: string;
  comment: string;
  result: string;
}

export const BoltResultsTable = () => {
  const boltResultsMock: BoltResultSchema[] = [
    {
      id: '1',
      boltNumber: '1',
      boltType: 'D47 MDX',
      peakLoad: '15',
      peakDisplacement: 'KSFG-5555',
      bitSize: 'VOG-252',
      rotations: '504',
      displacementPerTonnage: '48',
      level: '4002',
      drive: '2001',
      position: '20, 42',
      ring: 'RH-BACK',
      comment: 'N/A', // fix logic later
      result: 'Pass',
    },
    {
      id: '2',
      boltNumber: '2',
      boltType: 'D47 MDX',
      peakLoad: '15',
      peakDisplacement: 'KSFG-5555',
      bitSize: 'VOG-252',
      rotations: '504',
      displacementPerTonnage: '48',
      level: '4002',
      drive: '2001',
      position: '20, 42',
      ring: 'RH-BACK',
      comment: 'N/A',
      result: 'Fail',
    },
    {
      id: '3',
      boltNumber: '3',
      boltType: 'D47 MDX',
      peakLoad: '15',
      peakDisplacement: 'KSFG-5555',
      bitSize: 'VOG-252',
      rotations: '504',
      displacementPerTonnage: '48',
      level: '4002',
      drive: '2001',
      position: '20, 42',
      ring: 'RH-BACK',
      comment: 'N/A',
      result: 'Pass',
    },
    {
      id: '4',
      boltNumber: '4',
      boltType: 'D47 MDX',
      peakLoad: '15',
      peakDisplacement: 'KSFG-5555',
      bitSize: 'VOG-252',
      rotations: '504',
      displacementPerTonnage: '48',
      level: '4002',
      drive: '2001',
      position: '20, 42',
      ring: 'RH-BACK',
      comment: 'N/A',
      result: 'Pass',
    },
    {
      id: '5',
      boltNumber: '5',
      boltType: 'D47 MDX',
      peakLoad: '15',
      peakDisplacement: 'KSFG-5555',
      bitSize: 'VOG-252',
      rotations: '504',
      displacementPerTonnage: '48',
      level: '4002',
      drive: '2001',
      position: '20, 42',
      ring: 'RH-BACK',
      comment: 'N/A',
      result: 'Abort',
    },
    {
      id: '6',
      boltNumber: '6',
      boltType: 'D47 MDX',
      peakLoad: '15',
      peakDisplacement: 'KSFG-5555',
      bitSize: 'VOG-252',
      rotations: '504',
      displacementPerTonnage: '48',
      level: '4002',
      drive: '2001',
      position: '20, 42',
      ring: 'RH-BACK',
      comment: 'N/A',
      result: 'Pass',
    },
  ];

  const columns: ColumnDef<BoltResultSchema>[] = [
    {
      accessorKey: 'boltNumber',
      header: 'Bolt number',
      meta: {
        headerClassName: 'w-36',
      },
    },
    {
      accessorKey: 'boltType',
      header: 'Bolt type',
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
      header: () => <div className="text-right w-10">Result</div>,
      cell: ({ row }) => {
        return (
          // fix logic to get the three diff
          <div className="flex justify-end w-10">
            <Badge variant="success">
              <LucideCheckCircle />
              {row.getValue('result')}
            </Badge>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={boltResultsMock} />
      <Badge variant="neutral" className="self-start mt-5">
        {boltResultsMock.length} total
      </Badge>
    </>
  );
};
