import React from 'react';
import { BoltResultSchema } from '@/app/mock/mock';
import { Badge, Modal, ModalTrigger } from '@gsp/ui';
import { LucideSquareStack } from 'lucide-react';
import { BoltResultDetailsModal } from './BoltResultDetailsModal';

interface MultiReadBadgeProps {
  fullBoltData: BoltResultSchema;
}

export const MultiReadBadge = ({ fullBoltData }: MultiReadBadgeProps) => {
  return (
    <Modal>
      <ModalTrigger>
        <Badge variant="neutral">
          <LucideSquareStack />
        </Badge>
      </ModalTrigger>
      <BoltResultDetailsModal
        modalTitle={`Bolt ${fullBoltData.boltNumber}`}
        fullBoltData={fullBoltData}
      />
    </Modal>
  );
};
