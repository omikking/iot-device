import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { BoltResult } from '@/gql/graphql';
import { LucideCircleCheckBig } from 'lucide-react';
import styles from './BoltResultDetailsModal.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Text, Headline, LoadingSpinner } from '@gsp/ui';

type HazardCompleteModalContentProps = {
  boltResult: BoltResult;
  onClose: () => void;
  onSuccess?: () => void;
  initialView?: 'confirmation' | 'success';
};

// Modal view states
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

export const HazardCompleteModalContent = ({
  boltResult,
  onClose,
  onSuccess,
  initialView = 'confirmation',
}: HazardCompleteModalContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ModalView>(initialView);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, updateReportedHazard] = useMutation(updateHazard);

  // Ref for controlling animation
  const contentRef = useRef<HTMLDivElement>(null);

  const handleViewTransition = (nextView: ModalView) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Apply exit animation
    if (contentRef.current) {
      contentRef.current.classList.remove(styles.animateFadeIn);
      contentRef.current.classList.add(styles.animateFadeOut);
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
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        setTimeout(() => {
          onClose();
          // Reset to confirmation view for next time modal opens
          setTimeout(() => {
            setCurrentView('confirmation');
          }, 300);
        }, 1200);
      }
    } catch (error) {
      // TODO add error toaster
      console.error('Error updating hazard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply animation classes when view changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.remove(styles.animateFadeOut);
      contentRef.current.classList.add(styles.animateFadeIn);
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
    <>
      {/* Modal content based on current view with animation */}
      <div ref={contentRef} className={styles.animateFadeIn}>
        {currentView === 'confirmation' && renderConfirmationView()}
        {currentView === 'success' && renderSuccessView()}
      </div>

      <div className="px-10 pb-5 pt-8">
        <div className="flex justify-end items-end gap-5">
          {currentView === 'confirmation' && (
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
          )}
          <Button
            variant="outline"
            size="large"
            onClick={onClose}
            disabled={isTransitioning}
          >
            {currentView === 'success' ? 'Close' : 'Cancel'}
          </Button>
        </div>
      </div>
    </>
  );
};
