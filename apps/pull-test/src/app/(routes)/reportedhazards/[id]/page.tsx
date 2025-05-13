'use client';
import {
  Headline,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Modal,
} from '@gsp/ui';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import React, { useState } from 'react';
import { BoltResult } from '@/gql/graphql';
import { useSession } from 'next-auth/react';
import { GoBack } from '@/components/GoBack';
import { HazardCard } from '@/components/HazardCard';
import { HazardCompleteModal } from '@/components/HazardCompleteModal';
import { BoltResultDetailsModal } from '@/components/BoltResultDetailsModal';

const getHazardDetails = graphql(`
  query getHazardDetails($id: String!) {
    hazards(companyId: $id) {
      abortReason
      boltNumber
      boltType
      comment
      createdAt
      driveId
      hazardCompletedDate
      id
      image
      isHazard
      levelId
      locationId
      peakDisplacement
      peakLoad
      positionInRing
      result
      siteId
      updatedAt
      userId
    }
  }
`);

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  const companyId = session?.company?.id || '';
  const [modalHazardId, setModalHazardId] = useState<string | undefined>(
    undefined,
  );
  const [confirmationModalHazardId, setConfirmationModalHazardId] = useState<
    string | undefined
  >(undefined);

  const [{ data: hazardData }] = useQuery({
    query: getHazardDetails,
    variables: { id: companyId },
    pause: !companyId,
  });
  const hazards = (hazardData?.hazards as BoltResult[]) || [];

  const handleOpenDetailsModal = (hazardId: string) => {
    setModalHazardId(hazardId);
  };

  const handleCloseDetailsModal = () => {
    setModalHazardId(undefined);
  };

  const handleOpenConfirmationModal = (hazardId: string) => {
    setConfirmationModalHazardId(hazardId);
  };
  const handleCloseConfirmationModal = () => {
    setConfirmationModalHazardId(undefined);
  };

  const selectedHazardForModal = hazards.find((h) => h.id === modalHazardId);
  const selectedHazardForConfirmationModal = hazards.find(
    (h) => h.id === confirmationModalHazardId,
  );

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <Headline
        variant="xl"
        as="h1"
        color="foreground"
        className="md:text-center px-10"
      >
        Reported hazards
      </Headline>

      <GoBack />

      <Tabs
        defaultValue="active"
        className="flex w-full max-w-[1330px] flex-col mx-auto pb-10 gap-4"
      >
        <TabsList className="self-start">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="view all">View all</TabsTrigger>
        </TabsList>
        <TabsContent
          value="active"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {hazards.map(
            (boltResult) =>
              boltResult.isHazard && (
                <HazardCard
                  key={boltResult.id}
                  boltResult={boltResult}
                  onViewMore={() => handleOpenDetailsModal(boltResult.id)}
                  onCompleteClick={() =>
                    handleOpenConfirmationModal(boltResult.id)
                  }
                />
              ),
          )}
        </TabsContent>
        <TabsContent
          value="completed"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {hazards.map(
            (boltResult) =>
              !boltResult.isHazard && (
                <HazardCard
                  key={boltResult.id}
                  boltResult={boltResult}
                  onViewMore={() => handleOpenDetailsModal(boltResult.id)}
                />
              ),
          )}
        </TabsContent>
        <TabsContent
          value="view all"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {hazards.map((boltResult) => (
            <HazardCard
              key={boltResult.id}
              boltResult={boltResult}
              onViewMore={() => handleOpenDetailsModal(boltResult.id)}
            />
          ))}
        </TabsContent>
      </Tabs>

      {selectedHazardForModal && (
        <Modal
          open={!!modalHazardId}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleCloseDetailsModal();
          }}
        >
          <BoltResultDetailsModal
            boltResult={selectedHazardForModal}
            onClose={handleCloseDetailsModal}
            isHazardCompletable
          />
        </Modal>
      )}
      {selectedHazardForConfirmationModal && (
        <Modal
          open={!!confirmationModalHazardId}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleCloseConfirmationModal();
          }}
        >
          <HazardCompleteModal
            boltResult={selectedHazardForConfirmationModal}
            onClose={() => {
              handleCloseConfirmationModal();
            }}
          />
        </Modal>
      )}
    </main>
  );
}
