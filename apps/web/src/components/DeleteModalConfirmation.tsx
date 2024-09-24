import {
  Text,
  Button,
  Headline,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@gsp/ui';
import { LucideTrash2, LucideUserMinus } from 'lucide-react';
import React from 'react';

interface DeleteModalProps {
  modalTitel: string;
  confirmDelete?: string;
  deleteIcon?: string;
  confirmIcon?: string;

  deleteButtonText?: string;
  children: React.ReactNode;
}

export const DeleteModalConfirmation = ({
  modalTitel,
  confirmDelete = 'Confirm deletion',
  deleteIcon = 'PROPS',
  confirmIcon,

  deleteButtonText,
  children,
}: DeleteModalProps) => {
  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        {/* props drill titel */}
        <ModalTitle>{modalTitel}</ModalTitle>
      </ModalHeader>
      <div className="flex flex-row justify-center items-center pt-16 gap-4">
        {/* delete icon */}
        <LucideUserMinus className="text-error" size="32" />

        <Headline variant="medium" as="h3" color="foreground">
          {confirmDelete}
        </Headline>
      </div>
      <div className="flex flex-col justify-center items-center text-center pt-10 max-w-[350px] mx-auto">
        {children}
      </div>
      <ModalFooter className="ui-px-10 ui-py-6">
        <Button
          variant="destructive"
          size={'large'}
          className="hover:!text-main-white"
        >
          <LucideTrash2 />
          {deleteButtonText}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
