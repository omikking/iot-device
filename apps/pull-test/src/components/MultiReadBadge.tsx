import React from 'react';
import { BoltResultSchema } from '@/app/mock/mock';
import { Badge, Modal, ModalTrigger } from '@gsp/ui';
import { LucideSquareStack } from 'lucide-react';
import { MultiBoltReadingModal } from './MultiBoltReadingModal';

interface MultiReading {
  reading: string;
  peakLoad: string;
  peakDisplacement: string;
}

interface RowData {
  original: BoltResultSchema;
}

interface BoltSpecification {
  title: string;
  text: string;
}

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

export const MultiReadBadge = (
  row: RowData,
  multiReadings: MultiReading[],
  isHazard: boolean,
) => {
  const boltSpec = transformRowToSpecifications(row);
  return (
    <Modal>
      <ModalTrigger>
        <Badge variant="neutral">
          <LucideSquareStack />
        </Badge>
      </ModalTrigger>
      <MultiBoltReadingModal
        modalTitle={`Bolt ${row.original.boltNumber}`}
        image="/boltTestImage.png"
        isHazard={isHazard}
        author="Angela Moss"
        boltDescription="Bolt Description"
        viewBoltSpecifications={boltSpec}
        boltResults={multiReadings}
      />
    </Modal>
  );
};
