import React, { useState } from 'react';
import { BoltResult } from '@/gql/graphql';
import { Badge, Modal, ModalTrigger } from '@gsp/ui';
import { LucideScanSearch, LucideSquareStack } from 'lucide-react';
import { BoltResultDetailsModal } from './BoltResultDetailsModal';

type MultiReadBadgeProps = {
  fullBoltData: BoltResult;
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
