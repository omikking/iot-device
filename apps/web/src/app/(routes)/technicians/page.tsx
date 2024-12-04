'use client';
import { Button, Headline, Modal, ModalTrigger } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import { AddOrEditTechnicianModal } from '@/components/AddOrEditTechnicianModal';
import { TechniciansTable } from '@/components/TechniciansTable';
import { GoBack } from '@/components/GoBack';
import { useState } from 'react';
import { TechniciansSchema } from '@/app/mock/mock';

export default function Page(): JSX.Element {
  const [openTechModal, setOpenTechModal] = useState<boolean>(false);
  // selectedTechnician is used to pass the selected technician to the modal
  const [selectedTechnician, setSelectedTechnician] = useState<
    TechniciansSchema | undefined
  >(undefined);

  // handle the opening and closing of the modal, but also reset the selected technician when the modal is closed
  const handleModalClose = (open: boolean) => {
    setOpenTechModal(open);
    if (!open) {
      setSelectedTechnician(undefined);
    }
  };

  // @TODO Only superadmin should be able to see this page
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      <Headline as="h1" variant="xl" color="foreground">
        Technicians
      </Headline>

      <div className="flex flex-col items-end gap-5 w-full max-w-[1320px]">
        <Modal open={openTechModal} onOpenChange={handleModalClose}>
          <ModalTrigger asChild>
            <Button variant="primary" size="large">
              <LucidePlus />
              Add technician
            </Button>
          </ModalTrigger>
          <AddOrEditTechnicianModal
            onOpenChange={handleModalClose}
            technician={selectedTechnician}
          />
        </Modal>

        {/* openChange the handler for opening the modal inside */}
        <TechniciansTable
          onOpenChange={handleModalClose}
          onSelectTechnician={setSelectedTechnician}
        />
      </div>
    </main>
  );
}
