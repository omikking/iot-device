'use client';
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
import React, { useState } from 'react';
import { LucidePlus } from 'lucide-react';
import { GoBack } from '@/components/GoBack';
import { SitesTable } from '@/components/SitesTable';
import { AddOrEditSiteModal } from '@/components/AddOrEditSiteModal';
import { SiteResultSchema } from '@/app/mock/mock';
import { useParams } from 'next/navigation';
import { CompanyNameUrql } from '@/components/urql-selectapplications/SelectApplicationUrql';

export default function Page(): JSX.Element {
  const [app, setApp] = useState<'Pull Test' | 'xCyclops' | 'Ultrabolts'>(
    'Pull Test',
  );
  const [openSiteModal, setOpenSiteModal] = useState<boolean>(false);
  const [selectedSite, setSelectedSite] = useState<
    SiteResultSchema | undefined
  >(undefined);

  const handleModalToggle = (open: boolean) => {
    setOpenSiteModal(open);
    if (!open) {
      setSelectedSite(undefined);
    }
  };

  const params = useParams();
  
    const companyId = Array.isArray(params.id)
      ? params.id[0]
      : params.id;

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-28 gap-16 bg-main-white">
      <GoBack />
      <Badge variant="primary" size="large" className="absolute top-24">
        <CompanyNameUrql companyId={companyId} />
      </Badge>
      <Headline as="h1" variant="xl" color="foreground">
        Sites
      </Headline>

      <div className="flex flex-col items-end gap-5 w-full max-w-[1320px]">
        <Tabs defaultValue="pullTest" className="w-full">
          <div className="w-full flex flex-row justify-between items-center pb-4">
            <TabsList>
              <TabsTrigger value="pullTest" onClick={() => setApp('Pull Test')}>
                Pull Test
              </TabsTrigger>
              <TabsTrigger value="xCyclops" onClick={() => setApp('xCyclops')}>
                xCyclops
              </TabsTrigger>
              <TabsTrigger
                value="ultrabolts"
                onClick={() => setApp('Ultrabolts')}
              >
                Ultrabolts
              </TabsTrigger>
            </TabsList>

            <Modal open={openSiteModal} onOpenChange={handleModalToggle}>
              <ModalTrigger asChild>
                <Button variant="primary" size="large">
                  <LucidePlus />
                  Add site
                </Button>
              </ModalTrigger>
              <AddOrEditSiteModal
                onOpenChange={handleModalToggle}
                site={selectedSite}
                appSelected={app}
              />
            </Modal>
          </div>

          <TabsContent value="pullTest">
            <SitesTable
              onOpenChange={handleModalToggle}
              onSelectSite={setSelectedSite}
            />
          </TabsContent>

          <TabsContent value="xCyclops">
            <SitesTable
              onOpenChange={handleModalToggle}
              onSelectSite={setSelectedSite}
            />
          </TabsContent>

          <TabsContent value="ultrabolts">
            <SitesTable
              onOpenChange={handleModalToggle}
              onSelectSite={setSelectedSite}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
