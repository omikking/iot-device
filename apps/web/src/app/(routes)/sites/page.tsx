'use client';
import { GoBack } from '@/components/GoBack';
import {
  Badge,
  Button,
  Headline,
  Modal,
  ModalTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gsp/ui';
import { SitesTable } from '@/components/SitesTable';
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
        <Tabs defaultValue="pullTest" className="w-full">
          <div className="w-full flex flex-row justify-between items-center pb-4">
            <TabsList>
              <TabsTrigger value="pullTest">Pull Test</TabsTrigger>
              <TabsTrigger value="xCyclops">xCyclops</TabsTrigger>
              <TabsTrigger value="ultrabots">Ultrabots</TabsTrigger>
            </TabsList>

            <Modal>
              <ModalTrigger asChild>
                <Button variant="primary" size="large">
                  <LucidePlus />
                  Add site
                </Button>
              </ModalTrigger>
              <AddSiteModal />
            </Modal>
          </div>

          <TabsContent value="pullTest">
            <SitesTable />
          </TabsContent>

          <TabsContent value="xCyclops">
            <SitesTable />
          </TabsContent>

          <TabsContent value="ultrabots">
            <SitesTable />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
