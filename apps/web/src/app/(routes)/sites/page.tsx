'use client';
import { GoBack } from '@/components/GoBack';
import { Badge, Button, Headline, Modal, ModalTrigger } from '@gsp/ui';
import { SiteResultsTable } from '@/components/SitesTable';
import React from 'react';
import { LucidePlus } from 'lucide-react';
import { AddSiteModal } from '@/components/AddSiteModal';

export default function Page(): JSX.Element {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <GoBack />
      <Badge variant="primary" size="large" className="absolute top-24">
        Sites
      </Badge>
      <Headline as="h1" variant="xl" color="foreground">
        Sites
      </Headline>

      <div className="flex flex-col items-end gap-5 w-full max-w-[1320px]">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="primary" size="large">
              <LucidePlus />
              Add site
            </Button>
          </ModalTrigger>
          <AddSiteModal />
        </Modal>

        <SiteResultsTable />
      </div>
    </main>
  );
}
