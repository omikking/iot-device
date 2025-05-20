'use client';
import {
  Badge,
  Button,
  Headline,
  Modal,
  ModalTrigger,
  Tabs,
  TabsContent,
} from '@gsp/ui';
import React, { useState } from 'react';
import { LucidePlus } from 'lucide-react';
import { GoBack } from '@/components/GoBack';
import { SitesTable } from '@/components/SitesTable';
import { AddOrEditSiteModal } from '@/components/AddOrEditSiteModal';
import { Site } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useQuery } from 'urql';

const getCompanyName = graphql(`
  query getCompanyName($id: String!) {
    company(id: $id) {
      id
      name
    }
  }
`);

export default function Page({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  // const companyId = params.id;
  const companyId = '7fa6c15f-11c5-4d64-89ca-ab33ddb94a6e';

  const [{ data }] = useQuery({
    query: getCompanyName,
    variables: { id: companyId },
  });

  const companyName = data?.company?.name;

  // Commented out since not in MVP
  // const [, setApp] = useState<'Pull Test' | 'xCyclops' | 'Ultrabolts'>(
  //   'Pull Test',
  // );
  const [openSiteModal, setOpenSiteModal] = useState<boolean>(false);
  const [selectedSite, setSelectedSite] = useState<Site | undefined>(undefined);

  const handleModalToggle = (open: boolean) => {
    setOpenSiteModal(open);
    if (!open) {
      setSelectedSite(undefined);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-28 gap-16 bg-main-white">
      <GoBack />
      {companyName && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {companyName}
        </Badge>
      )}
      <Headline as="h1" variant="xl" color="foreground">
        Sites
      </Headline>

      <div className="flex flex-col items-end gap-5 w-full max-w-[1320px]">
        <Tabs defaultValue="pullTest" className="w-full">
          <div className="w-full flex flex-row justify-end items-center pb-4">
            {/* // Commented out since not in MVP */}
            {/* <TabsList>
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
            </TabsList> */}

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
              />
            </Modal>
          </div>

          <TabsContent value="pullTest">
            <SitesTable
              companyId={companyId}
              onOpenChange={handleModalToggle}
              onSelectSite={setSelectedSite}
            />
          </TabsContent>

          <TabsContent value="xCyclops">
            <SitesTable
              companyId={companyId}
              onOpenChange={handleModalToggle}
              onSelectSite={setSelectedSite}
            />
          </TabsContent>

          <TabsContent value="ultrabolts">
            <SitesTable
              companyId={companyId}
              onOpenChange={handleModalToggle}
              onSelectSite={setSelectedSite}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
