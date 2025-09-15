import React from 'react';
import {
  LucideEllipsis,
  LucideSquarePen,
  LucideTrash2,
  LucideMail,
} from 'lucide-react';
import {
  Text,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gsp/ui';

type DeleteEditDropdownProps = {
  itemSelected: string;
  openDeleteModal?: (itemSelected: string) => void;
  handleEdit?: (itemSelected: string) => void;
  onResendInvitation?: (itemSelected: string) => void;
  onCancelInvitation?: (itemSelected: string) => void;
};

export const DeleteEditDropdown = ({
  itemSelected,
  openDeleteModal,
  handleEdit,
  onResendInvitation,
  onCancelInvitation,
}: DeleteEditDropdownProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size={'small'} variant="outline">
          <LucideEllipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={onResendInvitation || onCancelInvitation ? 'w-56' : 'w-20'}
      >
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
        {onResendInvitation && (
          <DropdownMenuItem onClick={() => onResendInvitation(itemSelected)}>
            <LucideMail />
            <Text color={'foreground'} variant={'medium'}>
              Resend invitation
            </Text>
          </DropdownMenuItem>
        )}
        {onCancelInvitation && (
          <DropdownMenuItem onClick={() => onCancelInvitation(itemSelected)}>
            <LucideTrash2 className="text-error" />
            <Text color={'destructive'} variant={'medium'}>
              Cancel invitation
            </Text>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
