import React, { useState } from 'react';
import { BoltResult } from '@/gql/graphql';
import { Badge, Modal, ModalTrigger } from '@gsp/ui';
import { BoltResultDetailsModal } from './BoltResultDetailsModal';
import { LucideScanSearch, LucideSquareStack } from 'lucide-react';

type MultiReadBadgeProps = {
  boltResult: BoltResult;
};

export const MultiReadBadge = ({ boltResult }: MultiReadBadgeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <ModalTrigger>
        <Badge variant="neutral">
          <LucideSquareStack />
          <LucideScanSearch className="text-orange-primary" />
        </Badge>
      </ModalTrigger>
      <BoltResultDetailsModal
        boltResult={boltResult}
        onClose={() => setIsModalOpen(false)}
      />
    </Modal>
  );
};
