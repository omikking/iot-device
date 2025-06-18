import {
  Text,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gsp/ui';
import React from 'react';
import { LucideEllipsis, LucideSquarePen, LucideTrash2 } from 'lucide-react';

type DeleteEditDropdownProps = {
  itemSelected: string;
  openDeleteModal?: (itemSelected: string) => void;
  handleEdit?: (itemSelected: string) => void;
};

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
        {handleEdit && (
          <DropdownMenuItem onSelect={() => handleEdit(itemSelected)}>
            <LucideSquarePen />
            <Text color={'foreground'} variant={'medium'}>
              Edit
            </Text>
          </DropdownMenuItem>
        )}
        {openDeleteModal && (
          <DropdownMenuItem onClick={() => openDeleteModal(itemSelected)}>
            <LucideTrash2 className="text-error" />
            <Text color={'destructive'} variant={'medium'}>
              Delete
            </Text>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
