import React from 'react';
import { Button, Modal, ModalTrigger } from '@gsp/ui';
import { Badge } from '@gsp/ui';
import {
  LucideImage,
  LucideMessageSquareText,
  LucideMessageSquareWarning,
} from 'lucide-react';
import { MultiBoltReadingModal } from './MultiBoltReadingModal';
import { BoltResultSchema } from '@/app/mock/mock';

interface RowData {
  original: BoltResultSchema;
}

interface BoltSpecification {
  title: string;
  text: string;
}

interface MultiReading {
  reading: string;
  peakLoad: string;
  peakDisplacement: string;
}

interface BoltDetailsModalProps {
  row: RowData;
  isHazard: boolean;
  boltSpec: BoltSpecification[];
  multiReadings?: MultiReading[];
}

export const MultiBoltDetailsModal: React.FC<BoltDetailsModalProps> = ({
  row,
  isHazard,
  boltSpec,
  multiReadings,
}) => {
  return (
    <Modal>
      {row.original.image || row.original.comment || row.original.isHazard ? (
        // <ModalTrigger asChild>
        <ModalTrigger>
          <Badge variant="neutral">
            <div className="flex flex-row gap-2 items-center">
              {row.original.image && <LucideImage size={14} />}
              {row.original.comment && <LucideMessageSquareText size={14} />}
              {row.original.isHazard && (
                <LucideMessageSquareWarning size={14} className="text-error" />
              )}
              View
            </div>
          </Badge>
        </ModalTrigger>
      ) : (
        <ModalTrigger>
          <Badge variant="neutral">N/A</Badge>
        </ModalTrigger>
      )}

      <MultiBoltReadingModal
        modalTitle={`Bolt ${row.original.boltNumber}`}
        image="/boltTestImage.png"
        isHazard={isHazard}
        author="Angela Moss"
        boltDescription="Bolt Description"
        viewBoltSpecifications={boltSpec}
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
};
