'use client';
import { useState } from 'react';
import { LucidePlus } from 'lucide-react';
import { GoBack } from '@/components/GoBack';
import { GetAdminsQuery } from '@/gql/graphql';
import { Button, Headline, Modal, ModalTrigger } from '@gsp/ui';
import { AdministratorsTable } from '@/components/AdministratorsTable';
import { AddAdministratorModal } from '@/components/AddAdministratorModal';

export default function Page(): JSX.Element {
  const [openAdministratorsModal, setOpenAdministratorsModal] =
    useState<boolean>(false);
  const [selectedAdministrator, setSelectedAdministrator] = useState<
    GetAdminsQuery['users'][0] | undefined
  >(undefined);

  const handleToggleModal = (open: boolean) => {
    setOpenAdministratorsModal(open);
    if (!open) {
      setSelectedAdministrator(undefined);
    }
  };

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />

      <Headline as="h1" variant="xl" color="foreground">
        Administrators
      </Headline>

      <div className="flex flex-col items-end gap-5 w-full max-w-[1320px]">
        <Modal open={openAdministratorsModal} onOpenChange={handleToggleModal}>
          <ModalTrigger asChild>
            <Button variant="primary" size="large">
              <LucidePlus />
              Add administrator
            </Button>
          </ModalTrigger>
          <AddAdministratorModal
            onOpenChange={handleToggleModal}
            administrator={selectedAdministrator}
          />
        </Modal>

        <AdministratorsTable />
      </div>
    </main>
  );
}
