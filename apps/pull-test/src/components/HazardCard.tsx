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
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { BoltResult } from '@/gql/graphql';
import React, { useState } from 'react';
import { generateBoltSpecifications } from '@/libs/utils';

type HazardCardProps = {
  boltResult: BoltResult;
};

const getSiteNameQuery = graphql(`
  query getSiteName($id: String!) {
    site(id: $id) {
      siteName
    }
  }
`);

export const HazardCard = ({ boltResult }: HazardCardProps) => {
  const { isHazard, comment, createdAt } = boltResult;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const [{ data: siteData }] = useQuery({
    query: getSiteNameQuery,
    variables: { id: boltResult?.siteId || '' },
    pause: !boltResult?.siteId,
  });

  const siteName = siteData?.site?.siteName || 'N/A';

  return (
    <div className="w-[49%] max-w-[644px] flex flex-col border-2 border-neutral-2">
      <div className="flex flex-row border-b border-neutral-2 p-6 items-center justify-between">
        <Headline variant="small" as="h3" color="foreground" isBold>
          {formatDate(new Date(createdAt))}
        </Headline>
        {isHazard && (
          <Badge variant="attention">
            <LucideAlertTriangle />
            Hazard
          </Badge>
        )}
      </div>
      <div className="w-full flex flex-col xl:flex-row gap-6 py-4 px-6">
        <div className="pt-6 flex-grow">
          {boltResult &&
            (() => {
              const allSpecs = generateBoltSpecifications(boltResult, {});
              // Get first two and last two items
              const selectedSpecs = [
                ...allSpecs.slice(0, 2),
                ...allSpecs.slice(-2, -1),
              ];

              return selectedSpecs.map((boltSpec, i) => (
                <Specification
                  key={i}
                  title={boltSpec.title}
                  text={boltSpec.title === 'Site' ? siteName : boltSpec.text}
                />
              ));
            })()}
        </div>
        <div className="w-full xl:w-1/2 flex flex-col gap-2 min-h-40">
          <Text variant="small" color="foreground">
            Description
          </Text>
          <Textarea value={comment || ''} className="flex-grow" disabled />
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
            isHazardCompletable
            boltResult={boltResult}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
};
