'use client';
import { AddOrEditTechnicianModal } from '@/components/AddOrEditTechnicianModal';
import {
  Button,
  ContentHolder,
  Headline,
  Text,
  Anchor,
  Modal,
  ModalTrigger,
} from '@gsp/ui';
import { LucideMoveLeft, LucidePlus } from 'lucide-react';
import Link from 'next/link';

export default function Page(): JSX.Element {
  // Only superadmin should be able to see this page

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10"
      >
        <Link href="#" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft />
            Go back
          </Anchor>
        </Link>
      </Text>

      <Headline as="h1" variant="xl" color="foreground">
        Technicians
      </Headline>

      <div className="flex flex-col items-end">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="primary" size="large">
              <LucidePlus />
              Add technician
            </Button>
          </ModalTrigger>
          <AddOrEditTechnicianModal />
        </Modal>

        <ContentHolder variant="table"></ContentHolder>
      </div>
    </main>
  );
}
