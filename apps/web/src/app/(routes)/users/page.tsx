'use client';
import { useState } from 'react';
import { LucidePlus } from 'lucide-react';
import { UserSchema } from '@/app/mock/mock';
import { GoBack } from '@/components/GoBack';
import { UsersTable } from '@/components/UsersTable';
import { AddOrEditUserModal } from '@/components/AddOrEditUserModal';
import { Button, Headline, Badge, Modal, ModalTrigger } from '@gsp/ui';
import { useSession } from 'next-auth/react';

export default function Page(): JSX.Element {
  const { data: session } = useSession();

  const [openUserModal, setOpenUserModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserSchema | undefined>(
    undefined,
  );

  const handleModalClose = (open: boolean) => {
    setOpenUserModal(open);
    if (!open) {
      setSelectedUser(undefined);
    }
  };

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      {session?.company.name && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {session?.company.name}
        </Badge>
      )}

      <Headline as="h1" variant="xl" color="foreground">
        Users
      </Headline>

      <div className="flex flex-col items-end gap-5 w-full max-w-[1320px]">
        <Modal open={openUserModal} onOpenChange={handleModalClose}>
          <ModalTrigger asChild>
            <Button variant="primary" size="large">
              <LucidePlus />
              Add user
            </Button>
          </ModalTrigger>
          <AddOrEditUserModal
            onOpenChange={handleModalClose}
            user={selectedUser}
          />
        </Modal>
        <UsersTable
          onOpenChange={handleModalClose}
          onSelectUser={setSelectedUser}
        />
      </div>
    </main>
  );
}
