import {
  Button,
  ModalTitle,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalContent,
} from '@gsp/ui';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import React, { useState } from 'react';
import { BoltResult } from '@/gql/graphql';
import { LucideCircleCheckBig } from 'lucide-react';
import { HazardCompleteModalContent } from './HazardCompleteModalContent';
import { BoltResultDetailsModalContent } from './BoltResultDetailsModalContent';

type BoltResultDetailsModalProps = {
  isModalOpen: boolean;
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
  isModalOpen,
}: BoltResultDetailsModalProps) => {
  const [currentView, setCurrentView] = useState<ModalView>('details');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Queries for related data
  const [{ data: levelData }] = useQuery({
    query: getLevelDetails,
    variables: { id: boltResult?.levelId },
    pause: !isModalOpen,
  });

  const [{ data: driveData }] = useQuery({
    query: getDriveDetails,
    variables: { id: boltResult?.driveId },
    pause: !isModalOpen,
  });

  const [{ data: locationData }] = useQuery({
    query: getLocationDetails,
    variables: { id: boltResult?.locationId },
    pause: !isModalOpen,
  });

  const [{ data: nameData }] = useQuery({
    query: getNameDetails,
    variables: { id: boltResult?.userId },
    pause: !isModalOpen,
  });

  // Prepare site info for specs
  const siteInfo = {
    levelName: levelData?.level?.levelName || 'N/A',
    driveName: driveData?.drive?.driveName || 'N/A',
    locationName: locationData?.location?.locationName || 'N/A',
  };

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

  return (
    <ModalContent
      onEscapeKeyDown={currentView !== 'success' ? resetModal : undefined}
      onPointerDownOutside={currentView !== 'success' ? resetModal : undefined}
      className="overflow-y-auto w-96"
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
        {currentView === 'details' && (
          <BoltResultDetailsModalContent
            boltResult={boltResult}
            siteInfo={siteInfo}
            fullName={nameData?.user?.fullName || 'N/A'}
          />
        )}
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
              {boltResult?.isHazard && isHazardCompletable && (
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
