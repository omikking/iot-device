import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { BoltResult } from '@/gql/graphql';
import { LucideCircleCheckBig } from 'lucide-react';
import React, { useState } from 'react';
import { Button, Text, Headline } from '@gsp/ui';

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

  const handleViewTransition = (nextView: ModalView) => {
    setIsTransitioning(true);

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

  return (
    <>
      <div>
        {/* Confirmation view */}
        <div
          className={`absolute w-full flex flex-col items-center justify-center gap-6 p-4 h-[250px] transition-all duration-300 ${
            currentView === 'confirmation'
              ? 'opacity-100 z-10'
              : 'opacity-0 z-0'
          }`}
        >
          <div className="flex gap-4">
            <LucideCircleCheckBig size={30} className="text-success" />
            <Headline as="h3" color="foreground" variant="small" isBold>
              Confirm hazard completion
            </Headline>
          </div>
          <Text
            className="text-center w-2/3"
            color="foreground"
            variant="medium"
          >
            You are about to complete the selected hazard. Are you sure you want
            to complete it?
          </Text>
        </div>

        {/* Success view */}
        <div
          className={`flex flex-col items-center justify-center gap-6 p-4 h-[250px] transition-all duration-300 ${
            currentView === 'success'
              ? 'opacity-100 translate-y-[-10px] z-10'
              : 'opacity-0 translate-y-0 z-0'
          }`}
        >
          <div className="flex gap-4">
            <LucideCircleCheckBig size={30} className="text-success" />

            <Headline as="h3" color="foreground" variant="small" isBold>
              Hazard completed
            </Headline>
          </div>
        </div>
      </div>

      <div className="px-10 pb-2 pt-8">
        <div className="flex justify-end items-end gap-5">
          {(currentView === 'confirmation' || 'success') && (
            <Button
              size="large"
              variant="primary"
              isLoading={isLoading}
              disabled={
                isLoading || isTransitioning || currentView === 'success'
              }
              onClick={hazardConfirmed}
            >
              {!isLoading && <LucideCircleCheckBig />}
              Complete
            </Button>
          )}
          <Button
            variant="outline"
            size="large"
            onClick={onClose}
            disabled={isTransitioning || currentView === 'success'}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};
