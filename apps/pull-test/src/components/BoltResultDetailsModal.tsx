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
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { BoltResult } from '@/gql/graphql';
import { generateBoltSpecifications } from '@/libs/utils';
import React, { useState } from 'react';
import { MultiBoltReadingTable } from './MultiBoltReadingTable';
import { LucideCircleCheckBig, LucideTriangleAlert } from 'lucide-react';
import { HazardCompleteModalContent } from './HazardCompleteModalContent';

type BoltResultDetailsModalProps = {
  boltResult: BoltResult;
  onClose?: () => void;
  isHazardCompletable?: boolean;
};

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

const getNameDetails = graphql(`
  query getNameDetails($id: String!) {
    user(id: $id) {
      fullName
    }
  }
`);

// Modal view states
type ModalView = 'details' | 'confirmation' | 'success';

export const BoltResultDetailsModal = ({
  isHazardCompletable = false,
  boltResult,
  onClose,
}: BoltResultDetailsModalProps) => {
  const [currentView, setCurrentView] = useState<ModalView>('details');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Queries for related data
  const [{ data: levelData }] = useQuery({
    query: getLevelDetails,
    variables: { id: boltResult?.levelId },
  });

  const [{ data: driveData }] = useQuery({
    query: getDriveDetails,
    variables: { id: boltResult?.driveId },
  });

  const [{ data: locationData }] = useQuery({
    query: getLocationDetails,
    variables: { id: boltResult?.locationId },
  });

  const [{ data: nameData }] = useQuery({
    query: getNameDetails,
    variables: { id: boltResult?.userId },
  });

  // Prepare site info for specs
  const siteInfo = {
    levelName: levelData?.level?.levelName || 'N/A',
    driveName: driveData?.drive?.driveName || 'N/A',
    locationName: locationData?.location?.locationName || 'N/A',
  };

  const { image, isHazard, peakLoad, peakDisplacement } = boltResult || {};

  const handleViewTransition = (nextView: ModalView) => {
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentView(nextView);
      setIsTransitioning(false);
    }, 100);
  };

  const handleCompleteHazard = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleViewTransition('confirmation');
  };

  const resetModal = () => {
    handleViewTransition('details');
  };

  // TODO this should be moved to a separate component. Avoid render functions in general. Move to a file named BoltResultDetailsModalContent or similar.
  const renderDetailsView = () => (
    <div className="flex flex-col">
      {/* Image, Comment and Hazard Status */}
      {(image || boltResult.comment || isHazard) && (
        <div className="flex flex-grow pb-5 px-10 gap-10">
          {image && (
            <Image
              src={'/capybara.jpg'}
              alt="Attached bolt result image"
              width={390}
              height={280}
              className="rounded-md h-72 mt-10"
            />
          )}
          <div className="flex flex-col w-1/2">
            {boltResult.comment && (
              <div className="flex flex-col flex-grow pt-10">
                <Text variant="small" color="foreground">
                  Comment
                </Text>
                <Textarea
                  value={boltResult.comment}
                  className="mt-2 flex-grow"
                  disabled
                  readOnly
                />
              </div>
            )}
            <div className="flex pt-5 gap-4 items-center">
              {isHazard && (
                <>
                  <Badge variant={'attention'}>
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

      {!isHazard && (
        <div className="px-10">
          <Badge variant="success">
            <LucideCircleCheckBig />
            Completed
          </Badge>
        </div>
      )}

      <div className="px-10 pt-10">
        {/* Hazard Completion History */}
        {!boltResult?.isHazard && (
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
              {boltResult?.hazardCompletedDate?.map((date, index) => {
                const dateString = new Date(date).toISOString().split('T')[0];
                return (
                  <div key={index} className="flex flex-wrap">
                    <Specification
                      key={index}
                      title={'Date'}
                      text={dateString}
                      className="w-1/2"
                    />
                    <Specification title={''} text={''} className="w-1/2" />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Bolt Specifications */}
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
            {[...generateBoltSpecifications(boltResult, siteInfo).slice(1)].map(
              (boltSpec, index) => (
                <Specification
                  key={index}
                  title={boltSpec.title}
                  text={boltSpec.text}
                  className="w-1/2"
                />
              ),
            )}
            {generateBoltSpecifications(boltResult, siteInfo).length % 2 ===
              0 && <Specification title="" text="" className="w-1/2" />}
          </div>
        )}

        {/* Bolt Results */}
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
    </div>
  );

  return (
    <ModalContent
      onEscapeKeyDown={currentView !== 'success' ? resetModal : undefined}
      onPointerDownOutside={currentView !== 'success' ? resetModal : undefined}
      className={`overflow-y-auto w-96 ${
        currentView !== 'details' ? 'h-[450px]' : ''
      }`}
    >
      <ModalHeader>
        <ModalTitle>
          {currentView === 'details'
            ? `Bolt ${boltResult?.boltNumber}`
            : 'Complete hazard'}
        </ModalTitle>
      </ModalHeader>

      {/* Modal content based on current view with animation */}
      <div
        className={`transition-all duration-100 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        {currentView === 'details' && renderDetailsView()}

        {currentView !== 'details' && (
          <HazardCompleteModalContent
            boltResult={boltResult}
            onClose={resetModal}
            onSuccess={() => {
              onClose?.();
              setTimeout(() => {
                setCurrentView('details');
              }, 300);
            }}
            initialView={
              currentView === 'confirmation' ? 'confirmation' : 'success'
            }
          />
        )}
      </div>

      {currentView === 'details' && (
        <ModalFooter className="px-10 pb-5 pt-8">
          <ModalClose asChild>
            <div className="flex justify-end items-end gap-5">
              {isHazard && isHazardCompletable && (
                <Button
                  size="large"
                  variant="primary"
                  onClick={handleCompleteHazard}
                  disabled={isTransitioning}
                >
                  <LucideCircleCheckBig />
                  Complete
                </Button>
              )}
              <Button
                variant="outline"
                size="large"
                onClick={onClose}
                disabled={isTransitioning}
              >
                Close
              </Button>
            </div>
          </ModalClose>
        </ModalFooter>
      )}
    </ModalContent>
  );
};
