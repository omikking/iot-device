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
  LoadingSpinner,
  Specification,
} from '@gsp/ui';
import Image from 'next/image';
import React, { useState } from 'react';
import { BoltResult } from '@/gql/graphql';
import { MultiBoltReadingTable } from './MultiBoltReadingTable';
import { LucideCircleCheckBig, LucideTriangleAlert } from 'lucide-react';
import { generateBoltSpecifications } from '@/libs/utils';
import { graphql } from '@/gql';
import { useMutation, useQuery } from 'urql';

type BoltResultDetailsModalProps = {
  boltResult: BoltResult;
  onClose?: () => void;
  isHazardCompletable?: boolean;
};

// GraphQL queries
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

const updateHazard = graphql(`
  mutation updateBoltResult(
    $id: String!
    $updateBoltResultInput: UpdateBoltResultInput!
  ) {
    updateBoltResult(id: $id, updateBoltResultInput: $updateBoltResultInput) {
      isHazard
      hazardCompletedDate
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ModalView>('details');

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

  const [, updateReportedHazard] = useMutation(updateHazard);

  // Prepare site info for specs
  const siteInfo = {
    levelName: levelData?.level?.levelName || 'N/A',
    driveName: driveData?.drive?.driveName || 'N/A',
    locationName: locationData?.location?.locationName || 'N/A',
  };

  const { image, isHazard, peakLoad, peakDisplacement } = boltResult || {};

  const handleCompleteHazard = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCurrentView('confirmation');
  };

  const handleConfirmHazard = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);

    const currentHazardDates = Array.isArray(boltResult.hazardCompletedDate)
      ? boltResult.hazardCompletedDate
      : [];

    try {
      await updateReportedHazard({
        id: boltResult.id,
        updateBoltResultInput: {
          isHazard: false,
          hazardCompletedDate: [...currentHazardDates, Date.now()],
        },
      });

      setCurrentView('success');

      // Auto-close after successful completion
      setTimeout(() => {
        onClose?.();
        // Don't call resetModal here - it's not needed and can cause race conditions
      }, 3000);
    } catch (error) {
      // We could add a toast notification here for errors
      console.error('Failed to update hazard status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setCurrentView('details');
    setIsLoading(false);
  };

  const renderDetailsView = () => (
    <div className="transition-all duration-500">
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

  const renderConfirmationView = () => (
    <div className="flex flex-col items-center justify-center gap-6 p-4 h-[250px]">
      <div className="flex gap-4">
        <LucideCircleCheckBig size={30} className="text-success" />
        <Headline as="h3" color="foreground" variant="small" isBold>
          Confirm hazard completion
        </Headline>
      </div>

      <Text className="text-center w-2/3" color="foreground" variant="medium">
        You are about to complete the selected hazard. Are you sure you want to
        complete it?
      </Text>
    </div>
  );

  const renderSuccessView = () => (
    <div className="flex flex-col items-center justify-center gap-6 p-4 h-[250px]">
      <div className="flex gap-4">
        <LucideCircleCheckBig size={30} className="text-success" />
        <Headline as="h3" color="foreground" variant="small" isBold>
          Hazard completed
        </Headline>
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

      {/* Modal content based on current view */}
      {currentView === 'details' && renderDetailsView()}
      {currentView === 'confirmation' && renderConfirmationView()}
      {currentView === 'success' && renderSuccessView()}

      <ModalFooter className="px-10 pb-5 pt-8">
        {currentView === 'success' ? (
          // No close trigger wrapper in success view
          <div className="flex justify-end items-end gap-5">
            <Button variant="outline" size="large" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          // Use ModalClose wrapper for non-success views
          <ModalClose asChild>
            <div className="flex justify-end items-end gap-5">
              {isHazard && isHazardCompletable && currentView === 'details' && (
                <Button
                  size="large"
                  variant="primary"
                  onClick={handleCompleteHazard}
                >
                  <LucideCircleCheckBig />
                  Complete
                </Button>
              )}

              {currentView === 'confirmation' && (
                <Button
                  size="large"
                  variant="primary"
                  disabled={isLoading}
                  onClick={handleConfirmHazard}
                >
                  {isLoading ? (
                    <LoadingSpinner className="animate-spin" size={24} />
                  ) : (
                    <LucideCircleCheckBig />
                  )}
                  Complete
                </Button>
              )}

              <Button
                variant="outline"
                size="large"
                onClick={currentView !== 'details' ? resetModal : undefined}
              >
                Cancel
              </Button>
            </div>
          </ModalClose>
        )}
      </ModalFooter>
    </ModalContent>
  );
};
