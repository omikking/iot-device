import React, { useState } from 'react';
import { Modal, ModalTrigger } from '@gsp/ui';
import { Badge } from '@gsp/ui';
import {
  LucideImage,
  LucideMessageSquareText,
  LucideMessageSquareWarning,
} from 'lucide-react';
import { BoltResultDetailsModal } from './BoltResultDetailsModal';

type IHazard = {
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

const generateBoltSpecifications = (
  boltData: IHazard,
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

export const BoltCommentBadge = ({
  abortReason,
  boltNumber,
  boltType,
  comment,
  createdAt,
  driveId,
  hazardCompletedDate,
  id,
  image,
  isHazard,
  levelId,
  locationId,
  peakDisplacement,
  peakLoad,
  positionInRing,
  result,
  siteId,
  updatedAt,
  userId,
}: IHazard) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fullBoltData = {
    abortReason,
    boltNumber,
    boltType,
    comment,
    createdAt,
    driveId,
    hazardCompletedDate,
    id,
    image,
    isHazard,
    levelId,
    locationId,
    peakDisplacement,
    peakLoad,
    positionInRing,
    result,
    siteId,
    updatedAt,
    userId,
  };

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
