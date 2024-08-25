'use client';
import { Button, Headline, Text, Anchor, Modal, ModalTrigger } from '@gsp/ui';

import { LucideMoveLeft, LucidePlus } from 'lucide-react';

import { AddOrEditTechnicianModal } from '@/components/AddOrEditTechnicianModal';
import Link from 'next/link';
import { TechniciansTable } from '@/components/TechniciansTable';

export default function Page(): JSX.Element {
  // Only superadmin should be able to see this page

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10"
      >
        <Link href="/" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft size="24" />
            Go back
          </Anchor>
        </Link>
      </Text>

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
