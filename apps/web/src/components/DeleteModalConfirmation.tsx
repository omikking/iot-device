import {
  Button,
  Headline,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@gsp/ui';
import { LucideTrash2, LucideMountain, LucideUserMinus } from 'lucide-react';
import React from 'react';

interface DeleteModalConfirmationProps {
  modalTitle: string;
  deleteIcon?: 'User' | 'Site';
  deleteButtonText?: string;
  children: React.ReactNode;
}

export const DeleteModalConfirmation = ({
  modalTitle,
  deleteIcon = 'User',

  children,
}: DeleteModalConfirmationProps) => {
  const getDeleteIcon = (role: 'User' | 'Site') => {
    switch (role) {
      case 'User':
        return <LucideUserMinus className="text-error" size="32" />;
      case 'Site':
        return <LucideMountain className="text-error" size="32" />;
      default:
        return null; // throw null if invalid role
    }
  };

  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>{modalTitle}</ModalTitle>
      </ModalHeader>
      <div className="flex flex-row justify-center items-center pt-16 gap-4">
        {getDeleteIcon(deleteIcon)}
        <Headline variant="medium" as="h3" color="foreground">
          Confirm deletion
        </Headline>
      </div>
      <div className="flex flex-col justify-center items-center text-center pb-5 pt-10 max-w-[350px] mx-auto">
        {children}
      </div>
      <ModalFooter className="ui-px-10 ui-py-6">
        <Button variant="destructive" size={'large'}>
          <LucideTrash2 />
          Confirm deletion
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
