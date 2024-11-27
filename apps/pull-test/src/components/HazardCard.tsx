import * as React from 'react';
import {
  LucideAlertTriangle,
  LucideCircleCheckBig,
  LucideClipboardList,
} from 'lucide-react';
import {
  Headline,
  Text,
  Badge,
  Button,
  Textarea,
  Modal,
  ModalTrigger,
  Specification,
} from '@gsp/ui';
import { BoltResultDetailsModal } from './BoltResultDetailsModal';
import { BoltResultSchema } from '@/app/mock/mock';
import { useState } from 'react';

interface HazardCardProps {
  dateTitle: Date;
  isHazard?: boolean;
  author?: string;
  boltDescription?: string;
  boltInfoItems: {
    title: string;
    text: string;
  }[];
  fullBoltData?: BoltResultSchema;
}

interface BoltSpecification {
  title: string;
  text: string;
}

export const HazardCard = ({
  dateTitle,
  isHazard,
  boltDescription,
  fullBoltData,
}: HazardCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const specifications: BoltSpecification[] = [
    { title: 'Diameter', text: fullBoltData?.bitSize || '' },
    { title: 'Pass criteria', text: fullBoltData?.boltType || '' }, // Unsure what the value should be here
    { title: 'Location', text: fullBoltData?.location || '' },
  ];

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-[49%] max-w-[644px] flex flex-col border-2 border-neutral-2">
      <div className="flex flex-row border-b border-neutral-2 p-6 items-center justify-between">
        <Headline variant="small" as="h3" color="foreground" isBold>
          {formatDate(new Date(dateTitle))}
        </Headline>
        {isHazard && (
          <Badge variant="warning">
            <LucideAlertTriangle />
            Hazard
          </Badge>
        )}
      </div>
      <div className="w-full flex flex-col xl:flex-row gap-6 py-4 px-6">
        <div className="pt-6 flex-grow">
          {specifications.map((boltSpec, index) => (
            <Specification
              key={index}
              title={boltSpec.title}
              text={boltSpec.text}
            />
          ))}
        </div>
        <div className="w-full xl:w-1/2 flex flex-col gap-2 min-h-40">
          <Text variant="small" color="foreground">
            Description
          </Text>
          <Textarea value={boltDescription} className="flex-grow" disabled />
        </div>
      </div>
      <div className="flex flex-row justify-end py-4 px-6 gap-4">
        {isHazard && (
          <Button variant="primary" size="small">
            <LucideCircleCheckBig />
            Complete
          </Button>
        )}
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button variant="outline" size="small">
              <LucideClipboardList />
              View more
            </Button>
          </ModalTrigger>
          <BoltResultDetailsModal
            modalTitle={`Bolt ${fullBoltData?.boltNumber}`}
            fullBoltData={fullBoltData}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
};
