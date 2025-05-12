import React, { useState, useRef, useEffect } from 'react';
import {
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalClose,
  Button,
  Text,
  Headline,
  LoadingSpinner,
} from '@gsp/ui';
import { LucideCircleCheckBig } from 'lucide-react';
import { BoltResult } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useMutation } from 'urql';

type HazardCompleteModalProps = {
  boltResult: BoltResult;
  onClose: () => void;
};

type ModalView = 'confirmation' | 'success';

const updateHazard = graphql(`
  mutation updatedHazard(
    $id: String!
    $updateBoltResultInput: UpdateBoltResultInput!
  ) {
    updateBoltResult(id: $id, updateBoltResultInput: $updateBoltResultInput) {
      isHazard
      hazardCompletedDate
    }
  }
`);

export const HazardCompleteModal = ({
  boltResult,
  onClose,
}: HazardCompleteModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ModalView>('confirmation');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, updateReportedHazard] = useMutation(updateHazard);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleViewTransition = (nextView: ModalView) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Apply exit animation
    if (contentRef.current) {
      contentRef.current.classList.remove('animate-fade-in');
      contentRef.current.classList.add('animate-fade-out');
    }

    // Wait for animation to complete before changing view
    setTimeout(() => {
      setCurrentView(nextView);
      setIsTransitioning(false);
    }, 300);
  };

  const hazardConfirmed = async (
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

      handleViewTransition('success');
      setTimeout(() => {
        onClose();
        // Reset to confirmation view for next time modal opens
        setTimeout(() => {
          setCurrentView('confirmation');
        }, 300);
      }, 1200);
    } catch (error) {
      //@TODO Toast error message
      console.error('Error updating hazard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply animation classes when view changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.remove('animate-fade-out');
      contentRef.current.classList.add('animate-fade-in');
    }
  }, [currentView]);

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
      onEscapeKeyDown={currentView !== 'success' ? onClose : undefined}
      onPointerDownOutside={currentView !== 'success' ? onClose : undefined}
      className="overflow-y-auto w-96 h-[450px]"
    >
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-in-out forwards;
        }

        .animate-fade-out {
          animation: fadeOut 0.3s ease-in-out forwards;
        }
      `}</style>

      <ModalHeader>
        <ModalTitle>Complete hazard</ModalTitle>
      </ModalHeader>

      {/* Modal content based on current view with animation */}
      <div ref={contentRef} className="animate-fade-in">
        {currentView === 'confirmation' && renderConfirmationView()}
        {currentView === 'success' && renderSuccessView()}
      </div>

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
              <Button
                size="large"
                variant="primary"
                disabled={isLoading || isTransitioning}
                onClick={hazardConfirmed}
              >
                {isLoading ? (
                  <LoadingSpinner className="animate-spin" size={24} />
                ) : (
                  <LucideCircleCheckBig />
                )}
                Complete
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={onClose}
                disabled={isTransitioning}
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
