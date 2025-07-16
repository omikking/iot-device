'use client';
import { Badge, Button, Headline, Modal, ModalTrigger, Tabs } from '@gsp/ui';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { Site } from '@/gql/graphql';
import React, { useState } from 'react';
import { LucidePlus } from 'lucide-react';
import { GoBack } from '@/components/GoBack';
import { SitesTable } from '@/components/SitesTable';
import { AddOrEditSiteModal } from '@/components/AddOrEditSiteModal';

const getCompanyName = graphql(`
  query getCompanyName($id: String!) {
    company(id: $id) {
      id
      name
    }
  }
`);
const getCompanySitesQuery = graphql(`
  query getCompanySites($id: String!) {
    company(id: $id) {
      sites {
        id
        siteName
        address
        city
        country
        postalCode
        companyId
      }
    }
  }
`);
export default function Page({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  const companyId = params.id;

  const [{ data }] = useQuery({
    query: getCompanyName,
    variables: { id: companyId },
  });

  const companyName = data?.company?.name;

  // Commented out since not in MVP
  // const [, setApp] = useState<'Application.PullTest' | 'Application.Banshee'>(
  //   'Application.PullTest',
  // );

  const [sitesData, refetchSites] = useQuery({
    query: getCompanySitesQuery,
    variables: { id: companyId || '' },
  });
  const sites = (sitesData.data?.company.sites as Site[]) || [];

  const refreshSite = () => {
    refetchSites({ requestPolicy: 'network-only' });
  };

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
              <TabsTrigger value="pullTest" onClick={() => setApp('Application.PullTest')}>
                {getAppName(Application.PullTest)}
              </TabsTrigger>
              <TabsTrigger value="banshee" onClick={() => setApp('Application.Banshee')}>
                {getAppName(Application.Banshee)}
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
                refreshSites={refreshSite}
              />
            </Modal>
          </div>

          {/* <TabsContent value="pullTest"> */}
          <SitesTable
            companyId={companyId}
            onOpenChange={handleModalToggle}
            onSelectSite={setSelectedSite}
            sites={sites}
          />
          {/* </TabsContent> */}
        </Tabs>
      </div>
    </main>
  );
}
