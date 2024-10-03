'use client';

import { BoltResultSchema } from '@/app/mock/mock';
import {
  Badge,
  Button,
  DataTable,
  Modal,
  ModalTrigger,
  TableHeadWithSorting,
} from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';
import {
  LucideCheckCircle,
  LucideOctagonAlert,
  LucideSearchX,
  LucideSquareStack,
} from 'lucide-react';
import Link from 'next/link';
import { ViewExtendedBoltResultModal } from './ViewExtendedBoltResultModal';

interface BoltResultsTableProps {
  boltResults: BoltResultSchema[] | undefined;
  site?: string;
}

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
  }
};

export const BoltResultsTable = ({
  boltResults,
  site,
}: BoltResultsTableProps) => {
  const coolData = [
    {
      reading: '1',
      peakLoad: '5',
      peakDisplacement: '15',
    },
    {
      reading: '2',
      peakLoad: '7',
      peakDisplacement: '35',
    },
  ];

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
      cell: ({ row }) => {
        if (Array.isArray(row.getValue('peakLoad'))) {
          return (
            <div className="">
              <Modal>
                <ModalTrigger asChild>
                  <Button
                    variant="outline"
                    size="small"
                    className="border-none"
                  >
                    <Badge variant="neutral">
                      <LucideSquareStack />
                    </Badge>
                  </Button>
                </ModalTrigger>
                <ViewExtendedBoltResultModal
                  modalTitle="Bolt 424"
                  image="/boltTestImage.png"
                  isHazard={true}
                  author={'author'}
                  boltDescription={'boltDescription'}
                  viewBoltSpecifications={[
                    { title: 'Specification 1', text: 'daw' },
                    { title: 'Specification 2', text: 'dwaa' },
                  ]}
                  boltResults={coolData}
                />
              </Modal>
            </div>
          );
        } else {
          return <div>{row.getValue('peakLoad')}</div>;
        }
      },
    },
    {
      accessorKey: 'peakDisplacement',
      header: 'Peak displacement',
      cell: ({ row }) => {
        if (Array.isArray(row.getValue('peakDisplacement'))) {
          return (
            <div className="">
              <Link href="/">
                <Badge variant="neutral">
                  <LucideSquareStack />
                </Badge>
              </Link>
            </div>
          );
        } else {
          return <div>{row.getValue('peakDisplacement')}</div>;
        }
      },
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
      <DataTable
        columns={columns}
        data={boltResults || []}
        noResultMessage={
          !site
            ? 'Select site to view bolt results.'
            : 'No bolt results found for your search.'
        }
        variant="default"
      />
      <Badge variant="neutral" className="self-start mt-5">
        {boltResults?.length} total
      </Badge>
    </>
  );
};
// };
