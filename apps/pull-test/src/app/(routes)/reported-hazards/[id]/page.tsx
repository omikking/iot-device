'use client';
import {
  Badge,
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
import { GoBack } from '@/components/GoBack';
import { HazardCard } from '@/components/HazardCard';
import { HazardCompleteModal } from '@/components/HazardCompleteModal';
import { BoltResultDetailsModal } from '@/components/BoltResultDetailsModal';
import { Text } from '@gsp/ui';
import { LucideSearchX } from 'lucide-react';

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
  const companyId = params.id;

  const [{ data: hazardData }] = useQuery({
    query: getHazardDetails,
    variables: { id: companyId },
  });

  const hazards = (hazardData?.hazards as BoltResult[]) || [];
  const [{ data }] = useQuery({
    query: getCompanyName,
    variables: { id: companyId },
  });
  const companyName = data?.company?.name;

  const [openDetailsModal, setOpenDetailsModal] = useState<boolean>(false);

  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

  const [selectedHazardId, setSelectedHazardId] = useState<string | undefined>(
    undefined,
  );

  const handleBoltDetailsModalToggle = (open: boolean, hazardId?: string) => {
    if (open) {
      setSelectedHazardId(hazardId);
      setOpenDetailsModal(true);
    } else {
      setOpenDetailsModal(false);
      setTimeout(() => {
        setSelectedHazardId(undefined);
      }, 200);
    }
  };

  const handleCompleteConfirmationModalToggle = (
    open: boolean,
    hazardId?: string,
  ) => {
    if (open) {
      setSelectedHazardId(hazardId);
      setOpenConfirmationModal(true);
    } else {
      setOpenConfirmationModal(false);
      setTimeout(() => {
        setSelectedHazardId(undefined);
      }, 200);
    }
  };

  const NotFoundHazardMessage = () => (
    <div className="w-full flex h-80 flex-col justify-center items-center gap-5">
      <Text color="foreground" variant="medium">
        No reported hazards were found.
      </Text>
      <LucideSearchX className="text-neutral-5" />
    </div>
  );

  const selectedHazard = hazards.find((h) => h.id === selectedHazardId);

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
      {companyName && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {companyName}
        </Badge>
      )}
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
          {hazards.some((boltResult) => boltResult.isHazard) ? (
            hazards.map(
              (boltResult) =>
                boltResult.isHazard && (
                  <HazardCard
                    key={boltResult.id}
                    boltResult={boltResult}
                    onViewMore={() =>
                      handleBoltDetailsModalToggle(true, boltResult.id)
                    }
                    onCompleteClick={() =>
                      handleCompleteConfirmationModalToggle(true, boltResult.id)
                    }
                  />
                ),
            )
          ) : (
            <NotFoundHazardMessage />
          )}
        </TabsContent>

        <TabsContent
          value="completed"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {hazards.some((boltResult) => !boltResult.isHazard) ? (
            hazards.map(
              (boltResult) =>
                !boltResult.isHazard && (
                  <HazardCard
                    key={boltResult.id}
                    boltResult={boltResult}
                    onViewMore={() =>
                      handleBoltDetailsModalToggle(true, boltResult.id)
                    }
                  />
                ),
            )
          ) : (
            <NotFoundHazardMessage />
          )}
        </TabsContent>

        <TabsContent
          value="view all"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {hazards.length > 0 ? (
            hazards.map((boltResult) => (
              <HazardCard
                key={boltResult.id}
                boltResult={boltResult}
                onViewMore={() =>
                  handleBoltDetailsModalToggle(true, boltResult.id)
                }
                onCompleteClick={() =>
                  handleCompleteConfirmationModalToggle(true, boltResult.id)
                }
              />
            ))
          ) : (
            <NotFoundHazardMessage />
          )}
        </TabsContent>
      </Tabs>

      <Modal
        open={openDetailsModal}
        onOpenChange={handleBoltDetailsModalToggle}
      >
        {selectedHazard && (
          <BoltResultDetailsModal
            isHazardCompletable
            boltResult={selectedHazard}
            onClose={() => handleBoltDetailsModalToggle(false)}
            isModalOpen={openDetailsModal}
          />
        )}
      </Modal>

      <Modal
        open={openConfirmationModal}
        onOpenChange={handleCompleteConfirmationModalToggle}
      >
        {selectedHazard && (
          <HazardCompleteModal
            boltResult={selectedHazard}
            onClose={() => {
              handleCompleteConfirmationModalToggle(false);
            }}
          />
        )}
      </Modal>
    </main>
  );
}
