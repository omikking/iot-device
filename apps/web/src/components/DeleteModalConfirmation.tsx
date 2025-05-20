import {
  Text,
  Modal,
  Button,
  Headline,
  ModalTitle,
  ModalFooter,
  ModalHeader,
  ModalContent,
  LoadingSpinner,
} from '@gsp/ui';
import {
  LucideTrash2,
  LucideMountain,
  LucideUserMinus,
  LucideBuilding2,
  LucideAlertTriangle,
  LucideCheckCircle,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import styles from './DeleteModal.module.css';
import { useClient } from 'urql';

type DeleteModalConfirmationProps = {
  modalTitle: string;
  deleteIcon?: 'User' | 'Site' | 'Company';
  modalText?: string;
  deleteButtonText?: string;
  children: React.ReactNode;
  // onDelete: () => void;
  onDelete: () => Promise<boolean | void>;
  isOpen?: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSuccess?: () => void;
  initialView?: 'confirmDelete' | 'deleteSuccess';
  isLoading?: boolean;
};

type ModalView = 'confirmDelete' | 'deleteSuccess';

export const DeleteModalConfirmation = ({
  modalTitle,
  deleteIcon = 'User',
  deleteButtonText,
  children,
  modalText,
  onDelete,
  isOpen,
  onOpenChange,
  onSuccess,
  onClose,
  initialView = 'confirmDelete',
  isLoading,
}: DeleteModalConfirmationProps) => {
  // const [isLoading, setIsLoading] = useState(false);
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

  const contentRef = useRef<HTMLDivElement>(null);

  const handleViewTransition = (nextView: ModalView) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    if (contentRef.current) {
      contentRef.current.classList.remove(styles.animateFadeIn);
      contentRef.current.classList.add(styles.animateFadeOut);
    }

    setTimeout(() => {
      setCurrentView(nextView);
      setIsTransitioning(false);
    }, 300);
  };

  const handleDeleteConfirm = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    try {
      const result = await onDelete();
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
    } catch (error) {
      //TODO add toast?
      // Don't need to reset loading here as it's managed by parent
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.remove(styles.animateFadeOut);
      contentRef.current.classList.add(styles.animateFadeIn);
    }
  }, [currentView]);

  const renderConfirmDeleteView = () => (
    <div className="flex flex-col items-center justify-center gap-6 p-4 h-[250px]">
      <div className="flex flex-row justify-center items-center pt-16 gap-4">
        {getDeleteIcon(deleteIcon)}
        <Headline variant="medium" as="h3" color="foreground" isBold>
          {modalText || 'Confirm deletion'}
        </Headline>
      </div>
      {children}
    </div>
  );

  const renderDeleteSuccessView = () => (
    <div className="flex flex-col items-center justify-center gap-6 p-4 h-[250px]">
      <div className="flex pt-16 gap-4 items-center">
        <LucideCheckCircle size={30} className="text-success" />
        <Headline as="h3" color="foreground" variant="small" isBold>
          Deleted Successfully
        </Headline>
      </div>
      <Text className="text-center w-2/3" color="foreground" variant="medium">
        The {modalText} has been successfully deleted.
      </Text>
    </div>
  );

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalContent
        onEscapeKeyDown={onClose}
        onPointerDownOutside={onClose}
        // className="overflow-y-auto w-96 h-[450px]"
      >
        <ModalHeader>
          <ModalTitle>{modalTitle}</ModalTitle>
        </ModalHeader>

        <div ref={contentRef} className={styles.animateFadeIn}>
          {currentView === 'confirmDelete' && renderConfirmDeleteView()}
          {currentView === 'deleteSuccess' && renderDeleteSuccessView()}
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
              disabled={isTransitioning && currentView !== 'deleteSuccess'} // Allow closing on success view even if transitioning out
            >
              {currentView === 'deleteSuccess' ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
