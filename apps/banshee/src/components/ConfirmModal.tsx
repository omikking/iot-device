import {
  Text,
  Modal,
  Button,
  Headline,
  ModalTitle,
  ModalHeader,
  ModalContent,
} from '@gsp/ui-banshee';

import React from 'react';

type ConfirmModalProps = {
  isOpen?: boolean;
  modalTitle?: string;
  modalText?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
  commentBox?: string;
  tableView?: { title: string; value: string | string[] }[];
  modalConfirmButtonText?: string;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => boolean | Promise<boolean>;
};

export const ConfirmModal = ({
  isOpen,
  children,
  commentBox,
  modalTitle,
  modalConfirmButtonText = 'Confirm',
  tableView,
  onConfirm,
  onClose,
  onOpenChange,
}: ConfirmModalProps) => {
  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalContent
        onEscapeKeyDown={onClose}
        onPointerDownOutside={onClose}
        className="overflow-y-auto"
      >
        <ModalHeader>
          {modalTitle && <ModalTitle className="pb-9">{modalTitle}</ModalTitle>}
        </ModalHeader>
        {/* Content Container */}
        <div className="min-h-16">
          {children && (
            <div className="flex flex-col gap-6 items-center justify-center">
              {children}
            </div>
          )}
          {/* Table Container */}
          {tableView && (
            <div className="flex flex-col w-full">
              {tableView.map((table) => (
                <div
                  key={tableView.indexOf(table)}
                  className="flex flex-row p-2 justify-between border-b border-b-neutral-2"
                >
                  <div className="flex-1">
                    <Text variant="medium" color="foreground">
                      {table.title}
                    </Text>
                  </div>
                  <div className="flex-1">
                    {Array.isArray(table.value) ? (
                      <div>
                        {table.value.map((val) => (
                          <Text variant="medium" color="foreground">
                            {val}
                          </Text>
                        ))}
                      </div>
                    ) : (
                      <Text variant="medium" color="foreground">
                        {table.value}
                      </Text>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Headline only */}
          {commentBox && (
            <Headline
              variant="medium"
              as="h2"
              color="foreground"
              className="px-8 py-16"
            >
              {commentBox}
            </Headline>
          )}
        </div>

        {/* Confirm Button */}
        {onConfirm && (
          <div className="flex justify-end pt-9">
            <Button variant="primary" size={'large'} className="self-end" onClick={onClose}>
              {modalConfirmButtonText}
            </Button>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
