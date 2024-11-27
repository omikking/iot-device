import React, { useState } from 'react';
import { Modal, ModalTrigger } from '@gsp/ui';
import { Badge } from '@gsp/ui';
import {
  LucideImage,
  LucideMessageSquareText,
  LucideMessageSquareWarning,
} from 'lucide-react';
import { BoltResultDetailsModal } from './BoltResultDetailsModal';
import { BoltResultSchema } from '@/app/mock/mock';
interface BoltCommentBadgeProps {
  fullBoltData: BoltResultSchema;
}

export const BoltCommentBadge = ({ fullBoltData }: BoltCommentBadgeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { image, comment, isHazard } = fullBoltData;
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
        modalTitle={`Bolt ${fullBoltData.boltNumber}`}
        fullBoltData={fullBoltData}
        onClose={() => setIsModalOpen(false)}
      />
    </Modal>
  );
};
