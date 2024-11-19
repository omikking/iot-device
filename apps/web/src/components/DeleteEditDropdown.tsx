import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from '@gsp/ui';
import { LucideEllipsis, LucideSquarePen, LucideTrash2 } from 'lucide-react';
import React from 'react';

interface DeleteEditDropdownProps {
  itemToDelete: number;
  // eslint-disable-next-line no-unused-vars
  openDeleteModal: ((itemToDelete: number) => void) | (() => void);
  handleEdit: () => void;
}

export const DeleteEditDropdown = ({
  itemToDelete,
  openDeleteModal,
  handleEdit,
}: DeleteEditDropdownProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size={'small'} variant="outline">
          <LucideEllipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-4">
        <DropdownMenuItem onSelect={() => handleEdit()}>
          <LucideSquarePen />
          <Text color={'foreground'} variant={'medium'}>
            Edit
          </Text>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openDeleteModal(itemToDelete)}>
          <LucideTrash2 className="text-error" />
          <Text color={'destructive'} variant={'medium'}>
            Delete
          </Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
