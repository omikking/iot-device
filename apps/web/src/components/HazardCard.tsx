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
  boltDescription: string;
  boltInfoItems: {
    title: string;
    text: string;
    attribute: string;
    value: string;
  }[];
}

export const HazardCard = ({
  dateTitle,
  isHazard,
  boltDescription,
  boltInfoItems,
}: HazardCardProps) => {
  return (
    <div className="w-[644px] flex flex-col border-2 border-neutral-2">
      <div className="flex flex-row border-b border-neutral-2 p-6 items-center justify-between">
        <Headline variant="smallBold" as="h3" color="foreground">
          {dateTitle}
        </Headline>
        {isHazard && (
          <Badge variant="destructive">
            <LucideOctagonAlert />
            Hazard
          </Badge>
        )}
      </div>

      <div className="w-full flex flex-row gap-6 py-4 px-6">
        <div className="pt-6">
          {boltInfoItems.map((item) => (
            <div
              key={`${item.title}-${item.text}`}
              className="flex flex-row px-2 border-b border-neutral-3  py-2"
            >
              <div className="w-32">
                <Text variant="small" color="muted">
                  {item.title}
                </Text>
              </div>
              <div className="max-w-32">
                <Text variant="small" color="foreground">
                  {item.text}
                </Text>
              </div>
            </div>
          ))}
        </div>

        <div className="w-1/2 flex flex-col gap-2">
          <Text variant="small" color="foreground">
            Description
          </Text>
          <Textarea value={boltDescription} className="min-h-32" disabled />
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
            <div role="button" tabIndex={0}>
              <Button variant="outline" size="small">
                <LucideClipboardList />
                View more
              </Button>
            </div>
          </ModalTrigger>
          <ViewBoltResultModal
            modalTitle="Bolt 424"
            image=""
            isHazard={isHazard}
            boltDescription={boltDescription}
            viewBoltSpecifications={boltInfoItems}
          />
        </Modal>
      </div>
    </div>
  );
};

export default HazardCard;
