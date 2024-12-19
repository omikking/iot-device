'use client';
import { useState } from 'react';
import { LucidePlus } from 'lucide-react';
import { GoBack } from '@/components/GoBack';
import { Button, Headline, Modal, ModalTrigger } from '@gsp/ui';
import { AddOrEditAdministratorModal } from '@/components/AddOrEditAdministratorModal';
import { AdministratorsTable } from '@/components/AdministratorsTable';
import { AdministratorSchema } from '@/app/mock/mock';

export default function Page(): JSX.Element {
  const [openAdministratorsModal, setOpenAdministratorsModal] =
    useState<boolean>(false);
  const [selectedAdministrator, setSelectedAdministrator] = useState<
    AdministratorSchema | undefined
  >(undefined);

  const handleModalClose = (open: boolean) => {
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
        <Modal
          open={openAdministratorsModal}
          onOpenChange={setOpenAdministratorsModal}
        >
          <ModalTrigger asChild>
            <Button variant="primary" size="large">
              <LucidePlus />
              Add administrator
            </Button>
          </ModalTrigger>
          <AddOrEditAdministratorModal
            onOpenChange={setOpenAdministratorsModal}
            administrator={selectedAdministrator}
          />
        </Modal>

        <AdministratorsTable
          onOpenChange={handleModalClose}
          onSelectAdministrator={setSelectedAdministrator}
        />
      </div>
    </main>
  );
}
