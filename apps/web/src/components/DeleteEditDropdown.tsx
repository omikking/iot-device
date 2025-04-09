import {
  Text,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gsp/ui';
import React from 'react';
import { LucideEllipsis, LucideTrash2 } from 'lucide-react';

interface DeleteEditDropdownProps {
  itemSelected: string;
  openDeleteModal: (itemSelected: string) => void;
}

export const DeleteEditDropdown = ({
  itemSelected,
  openDeleteModal,
}: DeleteEditDropdownProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size={'small'} variant="outline">
          <LucideEllipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-4">
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
