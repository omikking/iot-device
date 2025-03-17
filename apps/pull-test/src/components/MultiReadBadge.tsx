import React, { useState } from 'react';
// import { BoltResultSchema } from '@/app/mock/mock';
import { Badge, Modal, ModalTrigger } from '@gsp/ui';
import { LucideScanSearch, LucideSquareStack } from 'lucide-react';
import { BoltResultDetailsModal } from './BoltResultDetailsModal';

type MultiReadBadgeProps = {
  fullBoltData: IBoltResultSchema;
};

type IBoltResultSchema = {
  abortReason?: string;
  boltNumber: number;
  boltType: string;
  comment?: string;
  createdAt: Date;
  driveId: string;
  hazardCompletedDate: Date[];
  id: string;
  image?: string;
  isHazard: boolean;
  levelId: string;
  locationId: string;
  peakDisplacement: number[];
  peakLoad: number[];
  positionInRing: string;
  result: string;
  siteId: string;
  updatedAt: Date;
  userId: string;
};

export const MultiReadBadge = ({ fullBoltData }: MultiReadBadgeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <ModalTrigger>
        <Badge variant="neutral">
          <LucideSquareStack />
          {/* @TODO be able to use from the tailwind config */}
          {/* <LucideScanSearch color="text-orange-primary" /> */}
          <LucideScanSearch className="text-orange-primary" />
        </Badge>
      </ModalTrigger>
      <BoltResultDetailsModal
        modalTitle={`Bolt ${fullBoltData.boltNumber}`}
        fullBoltData={fullBoltData}
        onClose={() => setIsModalOpen(false)}
        boltInfoItems={[
          { title: 'Bolt Type', text: fullBoltData.boltType },
          { title: 'Position', text: fullBoltData.positionInRing },
          { title: 'Result', text: fullBoltData.result },
        ]}
      />
    </Modal>
  );
};
