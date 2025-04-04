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
import React, { useEffect, useState } from 'react';

type HazardCardProps = {
  dateTitle: Date;
  isHazard?: boolean;
  boltDescription?: string;
  boltInfoItems: {
    title: string;
    text: string;
  }[];
  fullBoltData?: BoltResult;
};

const getMeSitesLocationDocument = graphql(`
  query getMeSiteLocation($id: String!) {
    site(id: $id) {
      siteName
    }
  }
`);

const getLevelDetails = graphql(`
  query getLevelDetails($id: String!) {
    level(id: $id) {
      id
      levelName
      siteId
    }
  }
`);

const getDriveDetails = graphql(`
  query getDriveDetails($id: String!) {
    drive(id: $id) {
      id
      driveName
    }
  }
`);

const getLocationDetails = graphql(`
  query getLocationDetails($id: String!) {
    location(id: $id) {
      id
      locationName
    }
  }
`);

export const HazardCard = ({
  dateTitle,
  isHazard,
  boltDescription,
  fullBoltData,
  boltInfoItems,
}: HazardCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const [{ data: siteData }] = useQuery({
    query: getMeSitesLocationDocument,
    variables: { id: fullBoltData?.siteId || '' },
    pause: !fullBoltData?.siteId, // avoid running query if siteId is undefined
  });

  // Level Query
  const [{ data: levelData }] = useQuery({
    query: getLevelDetails,
    variables: { id: fullBoltData?.levelId ?? '' },
    pause: !fullBoltData?.levelId,
  });

  // Drive Query
  const [{ data: driveData }] = useQuery({
    query: getDriveDetails,
    variables: { id: fullBoltData?.driveId ?? '' },
    pause: !fullBoltData?.driveId,
  });

  // Location Query
  const [{ data: locationData }] = useQuery({
    query: getLocationDetails,
    variables: { id: fullBoltData?.locationId ?? '' },
    pause: !fullBoltData?.locationId,
  });

  // Update the boltInfoItems with names from fetched data
  useEffect(() => {
    if (!fullBoltData) return;

    const siteName = siteData?.site?.siteName || 'N/A';
    const levelName = levelData?.level?.levelName || 'N/A';
    const driveName = driveData?.drive?.driveName || 'N/A';
    const locationName = locationData?.location?.locationName || 'N/A';

    // Create a copy of the original boltInfoItems
    const updatedItems = [...boltInfoItems];

    // Update the values
    updatedItems.forEach((item) => {
      if (item.title === 'Site') {
        item.text = siteName;
      } else if (item.title === 'Level') {
        item.text = levelName;
      } else if (item.title === 'Drive') {
        item.text = driveName;
      } else if (item.title === 'Location') {
        item.text = locationName;
      }
    });
  }, [
    boltInfoItems,
    siteData,
    levelData,
    driveData,
    locationData,
    fullBoltData,
  ]);

  const siteName = siteData?.site?.siteName || 'N/A';

  return (
    <div className="w-[49%] max-w-[644px] flex flex-col border-2 border-neutral-2">
      <div className="flex flex-row border-b border-neutral-2 p-6 items-center justify-between">
        <Headline variant="small" as="h3" color="foreground" isBold>
          {formatDate(new Date(dateTitle))}
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
          {[
            ...boltInfoItems.slice(0, 2),
            ...boltInfoItems.slice(
              boltInfoItems.length - 2,
              boltInfoItems.length - 1,
            ),
          ].map((boltSpec, i) => {
            if (boltSpec.title === 'Site') {
              return (
                <Specification key={i} title={boltSpec.title} text={siteName} />
              );
            }
            return (
              <Specification
                key={i}
                title={boltSpec.title}
                text={boltSpec.text}
              />
            );
          })}
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
            isHazardCompletable
            modalTitle={`Bolt ${fullBoltData?.boltNumber}`}
            fullBoltData={fullBoltData}
            boltInfoItems={boltInfoItems}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
};
