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
  itemSelected: number;
  openDeleteModal: ((itemSelected: number) => void) | (() => void);
  handleEdit: (itemSelected: number) => void;
}

export const DeleteEditDropdown = ({
  itemSelected,
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
        <DropdownMenuItem onSelect={() => handleEdit(itemSelected)}>
          <LucideSquarePen />
          <Text color={'foreground'} variant={'medium'}>
            Edit
          </Text>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openDeleteModal(itemSelected)}>
          <LucideTrash2 className="text-error" />
          <Text color={'destructive'} variant={'medium'}>
            Delete
          </Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
