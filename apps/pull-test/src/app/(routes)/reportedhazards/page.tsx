'use client';
import React from 'react';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { BoltResult } from '@/gql/graphql';
import { GoBack } from '@/components/GoBack';
import { HazardCard } from '@/components/HazardCard';
import { useSession } from 'next-auth/react';
import { Headline, Tabs, TabsContent, TabsList, TabsTrigger } from '@gsp/ui';

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

  const [{ data: hazardData }] = useQuery({
    query: getHazardDetails,
    variables: { id: companyId },
    pause: !companyId,
  });

  const hazards = (hazardData?.hazards as BoltResult[]) || [];
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
            (boltResult, index) =>
              boltResult.isHazard && (
                <HazardCard
                  key={index}
                  isHazard={boltResult.isHazard}
                  fullBoltData={boltResult}
                  dateTitle={boltResult.createdAt}
                  boltDescription={boltResult.comment ?? undefined}
                />
              ),
          )}
        </TabsContent>
        <TabsContent
          value="completed"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {hazards.map(
            (boltResult, index) =>
              !boltResult.isHazard && (
                <HazardCard
                  key={index}
                  isHazard={boltResult.isHazard}
                  fullBoltData={boltResult}
                  dateTitle={boltResult.createdAt}
                  boltDescription={boltResult.comment ?? undefined}
                />
              ),
          )}
        </TabsContent>
        <TabsContent
          value="view all"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {hazards.map((boltResult, index) => (
            <HazardCard
              key={index}
              isHazard={boltResult.isHazard}
              fullBoltData={boltResult}
              dateTitle={boltResult.createdAt}
              boltDescription={boltResult.comment ?? undefined}
            />
          ))}
        </TabsContent>
      </Tabs>
    </main>
  );
}
