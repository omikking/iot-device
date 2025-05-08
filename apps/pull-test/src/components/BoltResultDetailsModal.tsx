import React from 'react';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Textarea,
  Text,
  Badge,
  Headline,
  ModalClose,
  Specification,
} from '@gsp/ui';
import Image from 'next/image';
import { BoltResult } from '@/gql/graphql';
import { MultiBoltReadingTable } from './MultiBoltReadingTable';
import {
  LucideCircleCheckBig,
  LucideClipboardList,
  LucideTriangleAlert,
} from 'lucide-react';
import { generateBoltSpecifications } from '@/libs/utils';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { formatDate } from '@/utils/dateUtils';

// Data fetching queries
const queries = {
  level: graphql(`
    query getLevelDetails($id: String!) {
      level(id: $id) {
        id
        levelName
        siteId
      }
    }
  `),
  drive: graphql(`
    query getDriveDetails($id: String!) {
      drive(id: $id) {
        id
        driveName
      }
    }
  `),
  location: graphql(`
    query getLocationDetails($id: String!) {
      location(id: $id) {
        id
        locationName
      }
    }
  `),
  user: graphql(`
    query getNameDetails($id: String!) {
      user(id: $id) {
        fullName
      }
    }
  `),
};

type BoltResultDetailsModalProps = {
  boltResult: BoltResult;
  onClose: () => void;
  onCompleteRequest?: () => void;
  isHazardCompletable?: boolean;
};

export const BoltResultDetailsModal = ({
  boltResult,
  onClose,
  onCompleteRequest,
  isHazardCompletable = false,
}: BoltResultDetailsModalProps) => {
  // Fetch related data
  const [{ data: levelData }] = useQuery({
    query: queries.level,
    variables: { id: boltResult?.levelId },
    pause: !boltResult?.levelId,
  });

  const [{ data: driveData }] = useQuery({
    query: queries.drive,
    variables: { id: boltResult?.driveId },
    pause: !boltResult?.driveId,
  });

  const [{ data: locationData }] = useQuery({
    query: queries.location,
    variables: { id: boltResult?.locationId },
    pause: !boltResult?.locationId,
  });

  const [{ data: nameData }] = useQuery({
    query: queries.user,
    variables: { id: boltResult?.userId },
    pause: !boltResult?.userId,
  });

  // Prepare site info for bolt specifications
  const siteInfo = {
    levelName: levelData?.level?.levelName || 'N/A',
    driveName: driveData?.drive?.driveName || 'N/A',
    locationName: locationData?.location?.locationName || 'N/A',
  };

  const handleCompleteClick = () => {
    onClose();
    // Callback to open the hazard complete modal
    if (onCompleteRequest) {
      onCompleteRequest();
    }
  };

  const { image, isHazard, comment, peakLoad, peakDisplacement } = boltResult;
  const hasHazardHistory =
    Array.isArray(boltResult.hazardCompletedDate) &&
    boltResult.hazardCompletedDate.length > 0;

  return (
    <ModalContent
      onEscapeKeyDown={onClose}
      onPointerDownOutside={onClose}
      className="overflow-y-auto w-96"
    >
      <ModalHeader>
        <ModalTitle>Bolt {boltResult?.boltNumber}</ModalTitle>
      </ModalHeader>

      {/* Bolt Image, Comment, and Hazard Status */}
      {(image || comment || isHazard) && (
        <div className="flex flex-grow pb-5 px-10 gap-10">
          {image && (
            <Image
              src={'/capybara.jpg'} // This should be dynamic based on the image path
              alt="Attached bolt result image"
              width={390}
              height={280}
              className="rounded-md h-72 mt-10"
            />
          )}
          <div className="flex flex-col w-1/2">
            {comment && (
              <div className="flex flex-col flex-grow pt-10">
                <Text variant="small" color="foreground">
                  Comment
                </Text>
                <Textarea
                  value={comment}
                  className="mt-2 flex-grow"
                  disabled
                  readOnly
                />
              </div>
            )}
            <div className="flex pt-5 gap-4 items-center">
              {isHazard && (
                <>
                  <Badge variant="attention">
                    <LucideTriangleAlert />
                    Reported hazard
                  </Badge>
                  <Text variant="small" color="foreground">
                    Reported by: {nameData?.user?.fullName || 'N/A'}
                  </Text>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Completed Hazard Badge */}
      {!isHazard && (
        <div className="px-10">
          <Badge variant="success">
            <LucideCircleCheckBig />
            Completed
          </Badge>
        </div>
      )}

      <div className="px-10 pt-10">
        {/* Hazard Completion History Section */}
        {hasHazardHistory && (
          <>
            <Headline
              className="pb-4"
              variant="small"
              as="h3"
              color="foreground"
              isBold
            >
              Hazard completion history
            </Headline>
            <div className="pb-10">
              {boltResult.hazardCompletedDate?.map((date, index) => (
                <div key={index} className="flex flex-wrap">
                  <Specification
                    title="Date"
                    text={formatDate(date)}
                    className="w-1/2"
                  />
                  <Specification title="" text="" className="w-1/2" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Bolt Specifications Section */}
        <Headline
          className="pb-4"
          variant="small"
          as="h3"
          color="foreground"
          isBold
        >
          Bolt specifications
        </Headline>

        {boltResult && (
          <div className="flex flex-wrap">
            {generateBoltSpecifications(boltResult, siteInfo)
              .slice(1)
              .map((spec, index) => (
                <Specification
                  key={index}
                  title={spec.title}
                  text={spec.text}
                  className="w-1/2"
                />
              ))}
          </div>
        )}

        {/* Bolt Results Section */}
        <div>
          <Headline
            className="pt-10"
            variant="small"
            as="h3"
            color="foreground"
            isBold
          >
            Bolt results
          </Headline>
          <MultiBoltReadingTable
            peakLoad={peakLoad}
            peakDisplacement={peakDisplacement}
          />
        </div>
      </div>

      <ModalFooter className="px-10 pb-5 pt-8">
        <ModalClose asChild>
          <div className="flex justify-end items-end gap-5">
            {isHazard && isHazardCompletable && (
              <Button
                size="large"
                variant="primary"
                onClick={handleCompleteClick}
              >
                <LucideCircleCheckBig />
                Complete
              </Button>
            )}
            <Button variant="outline" size="large" onClick={onClose}>
              Close
            </Button>
          </div>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  );
};
