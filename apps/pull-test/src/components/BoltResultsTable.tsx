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
  LucideImage,
  LucideMessageSquareText,
  LucideMessageSquareWarning,
  LucideOctagonAlert,
  LucideSearchX,
  LucideSquareStack,
} from 'lucide-react';
import { MultiBoltReadingModal } from './MultiBoltReadingModal';

interface BoltResultsTableProps {
  boltResults: BoltResultSchema[] | undefined;
  site?: string;
}

interface RowData {
  original: BoltResultSchema;
}

interface MultiReading {
  reading: string;
  peakLoad: string;
  peakDisplacement: string;
}

const getResultBadge = (result: 'Pass' | 'Fail' | 'Abort') => {
  switch (result) {
    case 'Pass':
      return { variant: 'success', icon: <LucideCheckCircle /> };
    case 'Fail':
      return { variant: 'destructive', icon: <LucideOctagonAlert /> };
    case 'Abort':
      return { variant: 'warning', icon: <LucideSearchX /> };
    default:
      return { variant: 'neutral', icon: null };
  }
};

const renderModalButton = (
  // @TODO find a solution for any, it's a fast fix and not a good practice
  row: RowData,
  multiReadings: MultiReading[],
  isHazard: boolean,
) => (
  <Modal>
    <ModalTrigger asChild>
      <Button variant="outline" size="small" className="!p-0 border-none">
        <Badge variant="neutral">
          <LucideSquareStack />
        </Badge>
      </Button>
    </ModalTrigger>
    <MultiBoltReadingModal
      modalTitle={`Bolt ${row.original.boltNumber}`}
      image="/boltTestImage.png"
      isHazard={isHazard}
      author="author"
      boltDescription="boltDescription"
      viewBoltSpecifications={[
        {
          title: 'Displacement',
          text: row.original.peakDisplacement.toString(),
        },
        { title: 'Bit size', text: row.original.bitSize },
        { title: 'Pass criteria', text: row.original.boltType },
        { title: 'Rotations', text: row.original.rotations },
        { title: 'Level', text: row.original.level },
        { title: 'Peak load', text: row.original.peakLoad.toString() },
      ]}
      boltResults={multiReadings}
    />
  </Modal>
);

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
      cell: ({ row }) => {
        const { peakLoad, peakDisplacement } = row.original;
        if (Array.isArray(peakLoad) && Array.isArray(peakDisplacement)) {
          const multiReadings = peakLoad.map((load, index) => ({
            reading: (index + 1).toString(),
            peakLoad: load.toString(),
            peakDisplacement: peakDisplacement[index]?.toString(),
          }));
          return renderModalButton(row, multiReadings, true);
        }
        return <div>{row.getValue('peakLoad')}</div>;
      },
    },
    {
      accessorKey: 'peakDisplacement',
      header: 'Peak displacement',
      cell: ({ row }) => {
        const { peakLoad, peakDisplacement } = row.original;
        if (Array.isArray(peakLoad) && Array.isArray(peakDisplacement)) {
          const multiReadings = peakLoad.map((load, index) => ({
            reading: (index + 1).toString(),
            peakLoad: load.toString(),
            peakDisplacement: peakDisplacement[index]?.toString(),
          }));
          return renderModalButton(row, multiReadings, true);
        }
        return <div>{row.getValue('peakDisplacement')}</div>;
      },
      meta: { headerClassName: 'w-32' },
    },
    { accessorKey: 'bitSize', header: 'Bit size' },
    { accessorKey: 'rotations', header: 'Rotations' },
    {
      accessorKey: 'displacementPerTonnage',
      header: 'Displacement per tonnage',
      meta: { headerClassName: 'w-32' },
    },
    { accessorKey: 'level', header: 'Level' },
    { accessorKey: 'drive', header: 'Drive' },
    { accessorKey: 'position', header: 'Position' },
    { accessorKey: 'ring', header: 'Ring' },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: ({ row }) => {
        const isHazard = row.original.isHazard ?? false;
        const { peakLoad, peakDisplacement } = row.original;
        const multiReadings =
          Array.isArray(peakLoad) && Array.isArray(peakDisplacement)
            ? peakLoad.map((load, index) => ({
                reading: (index + 1).toString(),
                peakLoad: load.toString(),
                peakDisplacement: peakDisplacement[index]?.toString(),
              }))
            : null;
        // @TODO make every comment clickable
        return (
          <Modal>
            {row.original.image ||
            row.original.comment ||
            row.original.isHazard ? (
              <ModalTrigger asChild>
                <Button
                  variant="outline"
                  size="small"
                  className="!p-0 border-none"
                >
                  <Badge variant="neutral">
                    <div className="flex flex-row gap-2 items-center">
                      {row.original.image && <LucideImage size={14} />}
                      {row.original.comment && (
                        <LucideMessageSquareText size={14} />
                      )}
                      {row.original.isHazard && (
                        <LucideMessageSquareWarning
                          size={14}
                          className="text-error"
                        />
                      )}
                      View
                    </div>
                  </Badge>
                </Button>
              </ModalTrigger>
            ) : (
              <Badge variant="neutral">N/A</Badge>
            )}
            <MultiBoltReadingModal
              modalTitle="Bolt comment"
              image="/boltTestImage.png"
              isHazard={isHazard}
              author="Angela Moss"
              boltDescription="Bolt Description"
              viewBoltSpecifications={[
                {
                  title: 'Displacement',
                  text: row.original.peakDisplacement.toString(),
                },
                { title: 'Bit size', text: row.original.bitSize },
                { title: 'Pass criteria', text: row.original.boltType },
                { title: 'Rotations', text: row.original.rotations },
                { title: 'Level', text: row.original.level },
                { title: 'Peak load', text: row.original.peakLoad.toString() },
              ]}
              boltResults={
                multiReadings || [
                  {
                    reading: '1',
                    peakLoad: row.original.peakLoad.toString(),
                    peakDisplacement: row.original.peakDisplacement.toString(),
                  },
                ]
              }
            />
          </Modal>
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
        variant="default"
      />
      <Badge variant="neutral" className="self-start mt-5">
        {boltResults?.length || 0} total
      </Badge>
    </>
  );
};
