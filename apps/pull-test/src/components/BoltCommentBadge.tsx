import React, { useState } from 'react';
import { Modal, ModalTrigger } from '@gsp/ui';
import { Badge } from '@gsp/ui';
import {
  LucideImage,
  LucideMessageSquareText,
  LucideMessageSquareWarning,
} from 'lucide-react';
import { BoltResultDetailsModal } from './BoltResultDetailsModal';

type IHazardProps = {
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

export const BoltCommentBadge = ({
  image,
  comment,
  isHazard,
}: IHazardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
