import {
  LucideImage,
  LucideMessageSquareText,
  LucideMessageSquareWarning,
} from 'lucide-react';
import { Badge } from '@gsp/ui';
import React, { useState } from 'react';
import { BoltResult } from '@/gql/graphql';
import { Modal, ModalTrigger } from '@gsp/ui';
import { BoltResultDetailsModal } from './BoltResultDetailsModal';

type BoltCommentBadgeProps = {
  boltResult: BoltResult;
};

export const BoltCommentBadge = ({ boltResult }: BoltCommentBadgeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { image, comment, isHazard } = boltResult;

  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      {image || comment || isHazard ? (
        <ModalTrigger>
          <Badge variant="neutral">
            <div className="flex flex-row gap-2 items-center">
              {image && <LucideImage size={14} />}
              {comment && <LucideMessageSquareText size={14} />}
              {isHazard && (
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

      <BoltResultDetailsModal
        isModalOpen={isModalOpen}
        boltResult={boltResult}
        onClose={() => setIsModalOpen(false)}
        isModalOpen={isModalOpen}
      />
    </Modal>
  );
};
