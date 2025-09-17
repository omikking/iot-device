import {
  Modal,
  Button,
  Headline,
  ModalTitle,
  ModalHeader,
  ModalContent,
} from '@gsp/ui';
import {
  LucideMountain,
  LucideUserMinus,
  LucideBuilding2,
  LucideTrash2,
  LucideCircleAlert,
} from 'lucide-react';
import React, { useState } from 'react';

type DeleteModalConfirmationProps = {
  isOpen?: boolean;
  modalTitle: string;
  modalText?: string;
  isLoading?: boolean;
  deleteButtonText?: string;
  children: React.ReactNode;
  modalDeleteButtonText: string;
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
  modalText = 'Confirm deletion',
  isLoading,
  modalTitle,
  modalDeleteButtonText,
  deleteIcon = 'User',
  initialView = 'confirmDelete',
  onClose,
  onDelete,
  onSuccess,
  onOpenChange,
}: DeleteModalConfirmationProps) => {
  const [currentView, setCurrentView] = useState<ModalView>(initialView);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getDeleteIcon = (iconType: 'User' | 'Site' | 'Company') => {
    switch (iconType) {
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

    await Promise.resolve(onDelete()).then((result) => {
      if (result) {
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
                {modalText}
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
              <LucideCircleAlert size={30} className="text-blue-primary" />
              <Headline as="h3" color="foreground" variant="small" isBold>
                Successfully deleted
              </Headline>
            </div>
          </div>
        </div>

        <div className="px-10 pb-5 pt-8">
          <div className="flex justify-end items-end gap-5">
            <Button
              size="large"
              variant="destructive"
              disabled={
                isLoading || isTransitioning || currentView === 'deleteSuccess'
              }
              onClick={handleDeleteConfirm}
              isLoading={isLoading}
            >
              {!isLoading && <LucideTrash2 />}
              {modalDeleteButtonText}
            </Button>
            <Button
              variant="outline"
              size="large"
              onClick={onClose}
              disabled={isTransitioning || currentView === 'deleteSuccess'}
            >
              {currentView === 'deleteSuccess' ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
