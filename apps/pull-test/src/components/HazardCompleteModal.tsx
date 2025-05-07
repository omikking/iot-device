import React, { useState } from 'react';
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
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [, updateReportedHazard] = useMutation(updateHazard);

  const hazardConfirmed = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event?.preventDefault();
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
    } catch (error) {
      console.error('Error updating hazard:', error);
    }

    setTimeout(() => {
      setIsConfirmed(true);
      setIsLoading(false);

      setTimeout(() => {
        onClose?.();
      }, 1000);
    }, 1000);
  };

  return (
    <ModalContent
      onEscapeKeyDown={onClose}
      onPointerDownOutside={onClose}
      className="overflow-y-auto w-96 h-[450px]"
    >
      <ModalHeader>
        <ModalTitle>Complete hazard</ModalTitle>
      </ModalHeader>

      <div className="relative h-[250px]">
        {/* Confirmation View */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            !isConfirmed ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-6 p-4">
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
              You are about to complete the selected hazard. Are you sure you
              want to complete it?
            </Text>
          </div>
        </div>
        {/* Success View */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            isConfirmed
              ? 'opacity-100 translate-y-[-10px] z-10'
              : 'opacity-0 translate-y-0 z-0'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-6 p-4">
            <div className="flex gap-4">
              <LucideCircleCheckBig size={30} className="text-success" />
              <Headline as="h3" color="foreground" variant="small" isBold>
                Hazard completed
              </Headline>
            </div>
          </div>
        </div>
      </div>

      <ModalFooter className="px-10 pb-5 pt-8">
        <ModalClose asChild>
          <div className="flex justify-end items-end gap-5">
            <Button
              size="large"
              variant="primary"
              disabled={isConfirmed}
              onClick={hazardConfirmed}
            >
              {isLoading ? (
                <LoadingSpinner className="animate-spin" size={24} />
              ) : (
                <LucideCircleCheckBig />
              )}
              Complete
            </Button>
            <Button variant="outline" size="large" onClick={onClose}>
              {isConfirmed ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  );
};
