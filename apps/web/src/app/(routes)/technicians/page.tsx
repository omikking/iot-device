'use client';
import { Button, Headline, Modal, ModalTrigger } from '@gsp/ui';

import { LucidePlus } from 'lucide-react';

import { AddOrEditTechnicianModal } from '@/components/AddOrEditTechnicianModal';
import { TechniciansTable } from '@/components/TechniciansTable';
import { GoBack } from '@/components/GoBack';

export default function Page(): JSX.Element {
  // Only superadmin should be able to see this page

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      <Headline as="h1" variant="xl" color="foreground">
        Technicians
      </Headline>

      <div className="flex flex-col items-end gap-5 w-full max-w-[1320px]">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="primary" size="large">
              <LucidePlus />
              Add technician
            </Button>
          </ModalTrigger>
          <AddOrEditTechnicianModal />
        </Modal>

        <TechniciansTable />
      </div>
    </main>
  );
}
