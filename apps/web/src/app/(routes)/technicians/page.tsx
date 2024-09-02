'use client';
import { Button, Headline, Modal, ModalTrigger, GoBack } from '@gsp/ui';

import { LucidePlus } from 'lucide-react';

import { AddOrEditTechnicianModal } from '@/components/AddOrEditTechnicianModal';
import { TechniciansTable } from '@/components/TechniciansTable';

export default function Page(): JSX.Element {
  // Only superadmin should be able to see this page

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <GoBack />

      <Headline as="h1" variant="xl" color="foreground">
        Technicians
      </Headline>

      <div className="flex flex-col items-end gap-5">
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
