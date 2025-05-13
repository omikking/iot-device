import { BoltResult } from '@/gql/graphql';
import { ModalContent, ModalHeader, ModalTitle } from '@gsp/ui';
import { HazardCompleteModalContent } from './HazardCompleteModalContent';

export const HazardCompleteModal = ({
  boltResult,
  onClose,
}: {
  boltResult: BoltResult;
  onClose: () => void;
}) => {
  return (
    <ModalContent
      onEscapeKeyDown={onClose}
      onPointerDownOutside={onClose}
      className="overflow-y-auto w-96 h-[450px]"
    >
      <ModalHeader>
        <ModalTitle>Complete hazard</ModalTitle>
      </ModalHeader>

      <HazardCompleteModalContent boltResult={boltResult} onClose={onClose} />
    </ModalContent>
  );
};
