import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@gsp/ui-banshee';

interface BansheeListCommentModalProps {
  isOpen: boolean;
  bansheeName: string | null;
  comment: string | null;
  onClose: () => void;
}

export const BansheeListCommentModal = ({ isOpen, bansheeName, comment, onClose }: BansheeListCommentModalProps) => {
  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Comment: {bansheeName || 'Unknown'}</ModalTitle>
        </ModalHeader>
        <div className="ui-banshee-mt-4 ui-banshee-text-gray-700 ui-banshee-text-sm ui-banshee-whitespace-pre-wrap">
          {comment || 'No comment available.'}
        </div>
      </ModalContent>
    </Modal>
  );
};
