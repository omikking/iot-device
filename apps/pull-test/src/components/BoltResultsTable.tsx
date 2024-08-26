'use client';

import { Badge, DataTable } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';
import {
  LucideCheckCircle,
  LucideOctagonAlert,
  LucideSearchX,
} from 'lucide-react';

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
  result: 'Pass' | 'Fail' | 'Abort';
}
export const BoltResultsTable = () => {
  const getResultBadge = (
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
      default:
        return { variant: 'warning', icon: <LucideSearchX /> };
    }
  };

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
          <div className="flex justify-end w-10">
            <Badge variant={getResultBadge(row.getValue('result')).variant}>
              {getResultBadge(row.getValue('result')).icon}
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
