import {
  Text,
  Modal,
  Button,
  Headline,
  ModalTitle,
  ModalHeader,
  ModalContent,
  LoadingSpinner,
} from '@gsp/ui';
import {
  LucideTrash2,
  LucideMountain,
  LucideUserMinus,
  LucideBuilding2,
  LucideCheckCircle,
} from 'lucide-react';
import React, { useState } from 'react';

type DeleteModalConfirmationProps = {
  isOpen?: boolean;
  modalText?: string;
  modalTitle: string;
  isLoading?: boolean;
  children: React.ReactNode;
  deleteIcon?: 'User' | 'Site' | 'Company';
  initialView?: 'confirmDelete' | 'deleteSuccess';
  onClose: () => void;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
  onDelete: () => boolean | Promise<boolean>;
};

type ModalView = 'confirmDelete' | 'deleteSuccess';

export const DeleteModalConfirmation = ({
  isOpen,
  children,
  modalText,
  isLoading,
  modalTitle,
  deleteIcon = 'User',
  initialView = 'confirmDelete',
  onClose,
  onDelete,
  onSuccess,
  onOpenChange,
}: DeleteModalConfirmationProps) => {
  const [currentView, setCurrentView] = useState<ModalView>(initialView);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getDeleteIcon = (role: 'User' | 'Site' | 'Company') => {
    switch (role) {
      case 'User':
        return <LucideUserMinus className="text-error" size="32" />;
      case 'Site':
        return <LucideMountain className="text-error" size="32" />;
      case 'Company':
        return <LucideBuilding2 className="text-error" size="32" />;
      default:
        return null;
    }
  };

  // const contentRef = useRef<HTMLDivElement>(null);

  const handleViewTransition = (nextView: ModalView) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentView(nextView);
      setIsTransitioning(false);
    }, 300);
  };

  const handleDeleteConfirm = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    await Promise.resolve(onDelete())
      .then((result) => {
        if (result !== false) {
          handleViewTransition('deleteSuccess');

          if (onSuccess) {
            setTimeout(() => {
              onSuccess();
            }, 1500);
          } else {
            setTimeout(() => {
              setCurrentView('confirmDelete');
              onClose();
            }, 1200);
          }
        }
      })
      .catch((error) => {
        console.error('Error during deletion:', error);
      })
      .finally(() => {
        //remove later
        console.log('Deletion process completed');
      });
  };

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalContent onEscapeKeyDown={onClose} onPointerDownOutside={onClose}>
        <ModalHeader>
          <ModalTitle>{modalTitle}</ModalTitle>
        </ModalHeader>

        <div className="h-[250px] flex items-center justify-center">
          {/* Confirm Delete View */}
          <div
            className={`absolute flex flex-col items-center justify-center gap-6 p-4 transition-all duration-300 ${
              currentView === 'confirmDelete'
                ? 'opacity-100 translate-y-[-10px] z-10'
                : 'opacity-0 translate-y-0] z-0'
            }`}
          >
            <div className="flex flex-row justify-center items-center pt-16 gap-4">
              {getDeleteIcon(deleteIcon)}
              <Headline variant="medium" as="h3" color="foreground" isBold>
                {modalText || 'Confirm deletion'}
              </Headline>
            </div>
            {children}
          </div>

          {/* Delete Success View */}
          <div
            className={`absolute flex flex-col items-center justify-center gap-6 p-4 transition-all duration-300 ${
              currentView === 'deleteSuccess'
                ? 'opacity-100 translate-y-[-10px] z-10'
                : 'opacity-0 translate-y-0 z-0'
            }`}
          >
            <div className="flex flex-row pt-16 gap-4 items-center">
              <LucideCheckCircle size={30} className="text-success" />
              <Headline as="h3" color="foreground" variant="small" isBold>
                Deleted Successfully
              </Headline>
            </div>
            {/* Remove this text part? Can't see it in the figma design. */}
            <Text
              className="text-center w-full"
              color="foreground"
              variant="medium"
            >
              The {modalText} has been successfully deleted.
            </Text>
          </div>
        </div>

        <div className="px-10 pb-5 pt-8">
          <div className="flex justify-end items-end gap-5">
            {currentView === 'confirmDelete' && (
              <Button
                size="large"
                variant="destructive"
                disabled={isLoading || isTransitioning}
                onClick={handleDeleteConfirm}
              >
                {isLoading ? (
                  <LoadingSpinner className="animate-spin" size={24} />
                ) : (
                  <LucideTrash2 />
                )}
                Delete
              </Button>
            )}
            <Button
              variant="outline"
              size="large"
              onClick={onClose}
              disabled={isTransitioning && currentView !== 'deleteSuccess'}
            >
              {currentView === 'deleteSuccess' ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
