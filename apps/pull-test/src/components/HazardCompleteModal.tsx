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
  Alert,
} from '@gsp/ui';
import { LucideCircleCheckBig, LucideAlertTriangle } from 'lucide-react';
import { BoltResult } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useMutation } from 'urql';

// Types for component state management
type HazardCompletionState =
  | { status: 'confirming' }
  | { status: 'processing' }
  | { status: 'success' }
  | { status: 'error'; message: string };

type HazardCompleteModalProps = {
  boltResult: BoltResult;
  onClose: () => void;
};

// GraphQL mutation
const updateHazardMutation = graphql(`
  mutation updateHazard(
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
  // Single state for the whole completion flow
  const [state, setState] = useState<HazardCompletionState>({
    status: 'confirming',
  });
  const [, updateHazard] = useMutation(updateHazardMutation);

  // Handle completion confirmation
  const handleConfirm = async () => {
    setState({ status: 'processing' });

    const currentHazardDates = Array.isArray(boltResult.hazardCompletedDate)
      ? boltResult.hazardCompletedDate
      : [];

    try {
      const result = await updateHazard({
        id: boltResult.id,
        updateBoltResultInput: {
          isHazard: false,
          hazardCompletedDate: [...currentHazardDates, Date.now()],
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      setState({ status: 'success' });

      // Close the modal after showing success for a moment
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setState({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to complete hazard',
      });
    }
  };

  // Reset to confirmation view
  const handleReset = () => {
    setState({ status: 'confirming' });
  };

  // Determine if buttons should be disabled
  const isProcessing = state.status === 'processing';
  const isCompleted = state.status === 'success';

  return (
    <ModalContent
      onEscapeKeyDown={onClose}
      onPointerDownOutside={onClose}
      className="overflow-y-auto w-96 h-[450px]"
    >
      <ModalHeader>
        <ModalTitle>Complete hazard</ModalTitle>
      </ModalHeader>

      <div className="relative h-[280px] flex items-center justify-center">
        {/* Confirmation View */}
        {state.status === 'confirming' && (
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
        )}

        {/* Processing View (Loader) */}
        {state.status === 'processing' && (
          <div className="flex flex-col items-center justify-center gap-6 p-4">
            <LoadingSpinner size={48} className="animate-spin text-primary" />
            <Text className="text-center" color="foreground" variant="medium">
              Processing...
            </Text>
          </div>
        )}

        {/* Success View */}
        {state.status === 'success' && (
          <div className="flex flex-col items-center justify-center gap-6 p-4">
            <div className="flex gap-4">
              <LucideCircleCheckBig size={30} className="text-success" />
              <Headline as="h3" color="foreground" variant="small" isBold>
                Hazard completed
              </Headline>
            </div>
            <Text className="text-center" color="foreground" variant="medium">
              The hazard has been successfully marked as completed.
            </Text>
          </div>
        )}

        {/* Error View */}
        {state.status === 'error' && (
          <div className="flex flex-col items-center justify-center gap-6 p-4">
            <Alert variant="error">
              <LucideAlertTriangle className="h-4 w-4" />
              <Text className="text-center" color="foreground" variant="medium">
                {state.message}
              </Text>
            </Alert>
            <Text className="text-center" color="foreground" variant="medium">
              Please try again or contact support if the problem persists.
            </Text>
          </div>
        )}
      </div>

      <ModalFooter className="px-10 pb-5 pt-8">
        <ModalClose asChild>
          <div className="flex justify-end items-end gap-5">
            {state.status === 'confirming' && (
              <Button
                size="large"
                variant="primary"
                onClick={handleConfirm}
                disabled={isProcessing}
              >
                <LucideCircleCheckBig />
                Complete
              </Button>
            )}

            {state.status === 'error' && (
              <Button size="large" variant="primary" onClick={handleReset}>
                Try Again
              </Button>
            )}

            <Button
              variant="outline"
              size="large"
              onClick={onClose}
              disabled={isProcessing}
            >
              {isCompleted ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  );
};
