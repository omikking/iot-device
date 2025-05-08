import React, { useState } from 'react';
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
import { generateBoltSpecifications } from '@/libs/utils';
import { HazardCompleteModal } from './HazardCompleteModal';
import { formatDate } from '@/utils/dateUtils';

// GraphQL query to get site name
const getSiteNameQuery = graphql(`
  query getSiteName($id: String!) {
    site(id: $id) {
      siteName
    }
  }
`);

type HazardCardProps = {
  boltResult: BoltResult;
};

export const HazardCard = ({ boltResult }: HazardCardProps) => {
  const { isHazard, comment, createdAt } = boltResult;

  // Modal visibility states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // Fetch site data
  const [{ data: siteData }] = useQuery({
    query: getSiteNameQuery,
    variables: { id: boltResult?.siteId || '' },
    pause: !boltResult?.siteId,
  });

  const siteName = siteData?.site?.siteName || 'N/A';

  // Generate specifications for card display
  const allSpecs = generateBoltSpecifications(boltResult, { siteName });
  // Get first two specs and the second-to-last spec
  const displaySpecs = [...allSpecs.slice(0, 2), ...allSpecs.slice(-2, -1)];

  // Handlers for modal operations
  const openCompleteModal = () => {
    setIsCompleteModalOpen(true);
  };

  const handleHazardCompleted = () => {
    setIsCompleteModalOpen(false);
  };

  return (
    <div className="w-[49%] max-w-[644px] flex flex-col border-2 border-neutral-2">
      {/* Card Header */}
      <div className="flex flex-row border-b border-neutral-2 p-6 items-center justify-between">
        <Headline variant="small" as="h3" color="foreground" isBold>
          {formatDate(createdAt)}
        </Headline>
        {isHazard && (
          <Badge variant="attention">
            <LucideAlertTriangle />
            Hazard
          </Badge>
        )}
      </div>

      {/* Card Content */}
      <div className="w-full flex flex-col xl:flex-row gap-6 py-4 px-6">
        {/* Specifications */}
        <div className="pt-6 flex-grow">
          {displaySpecs.map((spec, i) => (
            <Specification
              key={i}
              title={spec.title}
              text={spec.title === 'Site' ? siteName : spec.text}
            />
          ))}
        </div>

        {/* Description */}
        <div className="w-full xl:w-1/2 flex flex-col gap-2 min-h-40">
          <Text variant="small" color="foreground">
            Description
          </Text>
          <Textarea value={comment || ''} className="flex-grow" disabled />
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex flex-row justify-end py-4 px-6 gap-4">
        {/* Complete Hazard Button */}
        {isHazard && (
          <Button variant="primary" size="small" onClick={openCompleteModal}>
            <LucideCircleCheckBig />
            Complete
          </Button>
        )}

        {/* View Details Button */}
        <Button
          variant="outline"
          size="small"
          onClick={() => setIsDetailsModalOpen(true)}
        >
          <LucideClipboardList />
          View more
        </Button>
      </div>

      {/* Hazard Complete Modal */}
      <Modal open={isCompleteModalOpen} onOpenChange={setIsCompleteModalOpen}>
        <HazardCompleteModal
          boltResult={boltResult}
          onClose={handleHazardCompleted}
        />
      </Modal>

      {/* Bolt Details Modal */}
      <Modal open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <BoltResultDetailsModal
          boltResult={boltResult}
          onClose={() => setIsDetailsModalOpen(false)}
          onCompleteRequest={openCompleteModal}
          isHazardCompletable={isHazard}
        />
      </Modal>
    </div>
  );
};
