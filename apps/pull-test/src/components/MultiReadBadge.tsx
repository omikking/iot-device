import React, { useState } from 'react';
import { BoltResultSchema } from '@/app/mock/mock';
import { Badge, Modal, ModalTrigger } from '@gsp/ui';
import { LucideScanSearch, LucideSquareStack } from 'lucide-react';
import { BoltResultDetailsModal } from './BoltResultDetailsModal';

interface MultiReadBadgeProps {
  fullBoltData: BoltResultSchema;
}

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
      />
    </Modal>
  );
};
