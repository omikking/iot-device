import React, { useState } from 'react';
import { Modal, ModalTrigger } from '@gsp/ui';
import { Badge } from '@gsp/ui';
import {
  LucideImage,
  LucideMessageSquareText,
  LucideMessageSquareWarning,
} from 'lucide-react';
import { BoltResult } from '@/gql/graphql';
import { BoltResultDetailsModal } from './BoltResultDetailsModal';

type BoltCommentBadgeProps = {
  fullBoltData: BoltResult;
};

const capitalizeFirstLetter = (text: string | null | undefined): string => {
  if (!text) return 'N/A';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const generateBoltSpecifications = (
  boltData: BoltResult,
  names: {
    siteName?: string;
    levelName?: string;
    driveName?: string;
    locationName?: string;
  },
) => {
  return [
    {
      title: 'Site',
      text: names.siteName || 'N/A',
    },
    {
      title: 'Bolt',
      text: boltData.boltNumber?.toString() || 'N/A',
    },
    {
      title: 'Bolt type',
      text: boltData.boltType || 'N/A',
    },
    {
      title: 'Level',
      text: names.levelName || 'N/A',
    },
    {
      title: 'Drive',
      text: names.driveName || 'N/A',
    },
    {
      title: 'Location',
      text: names.locationName || 'N/A',
    },
    {
      title: 'Position in ring',
      text: boltData.positionInRing.replaceAll('_', '-') || 'N/A',
    },
    {
      title: 'Result',
      text: capitalizeFirstLetter(boltData.result) || 'N/A',
    },
    {
      title: 'Abort Reason',
      text:
        capitalizeFirstLetter(boltData.abortReason).replaceAll('_', ' ') ||
        'N/A',
    },
  ];
};

export const BoltCommentBadge = ({ fullBoltData }: BoltCommentBadgeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { boltNumber, image, comment, isHazard } = fullBoltData;

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
        modalTitle={`Bolt ${boltNumber}`}
        fullBoltData={fullBoltData}
        boltInfoItems={generateBoltSpecifications(fullBoltData, {})}
        onClose={() => setIsModalOpen(false)}
      />
    </Modal>
  );
};
