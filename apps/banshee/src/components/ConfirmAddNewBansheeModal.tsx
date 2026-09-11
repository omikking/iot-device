'use client';

import {
  Text,
  Modal,
  Button,
  ModalTitle,
  ModalHeader,
  ModalContent,
} from '@gsp/ui-banshee';
import React from 'react';

type ConfirmAddNewBansheeModalProps = {
  isOpen?: boolean;
  name: string;
  quantity: number;
  isLoading?: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => boolean | Promise<boolean>;
};

export const ConfirmAddNewBansheeModal = ({
  isOpen,
  name,
  quantity,
  isLoading = false,
  onConfirm,
  onClose,
  onOpenChange,
}: ConfirmAddNewBansheeModalProps) => {
  const handleConfirm = async () => {
    const result = await onConfirm();
    if (result) {
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalContent
        onEscapeKeyDown={onClose}
        onPointerDownOutside={onClose}
        className="ui-banshee-overflow-y-auto"
      >
        <ModalHeader>
          <ModalTitle className="ui-banshee-pb-9 ui-banshee-text-3xl!">
            Add new Banshee
          </ModalTitle>
        </ModalHeader>

        <div className="ui-banshee-min-h-16">
          <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full">
            <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-p-4 ui-banshee-justify-between ui-banshee-border-b ui-banshee-border-b-neutral-2 hover:ui-banshee-bg-neutral-50">
              <div className="ui-banshee-flex-1">
                <Text
                  variant="medium"
                  color="foreground"
                  className="ui-banshee-font-semibold"
                >
                  Banshee
                </Text>
              </div>
              <div className="ui-banshee-flex-1">
                <Text variant="medium" color="foreground">
                  {name || '-'}
                </Text>
              </div>
            </div>

            <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-p-4 ui-banshee-justify-between ui-banshee-border-b ui-banshee-border-b-neutral-2 hover:ui-banshee-bg-neutral-50">
              <div className="ui-banshee-flex-1">
                <Text
                  variant="medium"
                  color="foreground"
                  className="ui-banshee-font-semibold"
                >
                  Quantity
                </Text>
              </div>
              <div className="ui-banshee-flex-1">
                <Text variant="medium" color="foreground">
                  {quantity}
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="ui-banshee-flex ui-banshee-justify-end ui-banshee-pt-6">
          <Button
            variant="primary"
            size="large"
            className="ui-banshee-self-end"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Confirming...' : 'Confirm'}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};
