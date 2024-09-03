import * as React from 'react';
import {
  LucideCircleCheckBig,
  LucideClipboardList,
  LucideOctagonAlert,
} from 'lucide-react';
import {
  Headline,
  Text,
  Badge,
  Button,
  Textarea,
  Modal,
  ModalTrigger,
} from '@gsp/ui';
import { ViewBoltResultModal } from './ViewBoltResultModal';

interface HazardCardProps {
  dateTitle: string;
  isHazard: boolean;
  author?: string;
  boltDescription: string;
  boltInfoItems: {
    title: string;
    text: string;
  }[];
}

export const HazardCard = ({
  dateTitle,
  isHazard,
  author,
  boltDescription,
  boltInfoItems,
}: HazardCardProps) => {
  return (
    <div className="w-[49%] max-w-[644px] flex flex-col border-2 border-neutral-2">
      <div className="flex flex-row border-b border-neutral-2 p-6 items-center justify-between">
        <Headline variant="smallBold" as="h3" color="foreground">
          {dateTitle}
        </Headline>
        {isHazard && (
          <Badge variant="warning">
            <LucideOctagonAlert />
            Hazard
          </Badge>
        )}
      </div>
      <div className="w-full flex flex-col xl:flex-row gap-6 py-4 px-6">
        <div className="pt-6 flex-grow">
          {boltInfoItems.slice(0, 3).map((item) => (
            <div
              key={`${item.title}-${item.text}`}
              className="flex flex-row items-center px-2 border-b border-neutral-3 py-2 break-words"
            >
              <Text className="w-32" variant="small" color="muted">
                {item.title}
              </Text>

              <Text className="max-w-32" variant="small" color="foreground">
                {item.text}
              </Text>
            </div>
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
        <Modal>
          <ModalTrigger asChild>
            <Button variant="outline" size="small">
              <LucideClipboardList />
              View more
            </Button>
          </ModalTrigger>
          <ViewBoltResultModal
            modalTitle="Bolt 424"
            image="/boltTestImage.png"
            isHazard={isHazard}
            author={author}
            boltDescription={boltDescription}
            viewBoltSpecifications={boltInfoItems}
          />
        </Modal>
      </div>
    </div>
  );
};
