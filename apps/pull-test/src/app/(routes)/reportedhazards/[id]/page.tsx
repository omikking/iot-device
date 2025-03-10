'use client';
import React from 'react';
// import { useParams } from 'next/navigation';
import { GoBack } from '@/components/GoBack';
import { HazardCard } from '@/components/HazardCard';
import { boltSpecifications } from '@/app/mock/mock';
import { Headline, Tabs, TabsContent, TabsList, TabsTrigger } from '@gsp/ui';
import { useBoltResults } from '@/components/urql-reportedhazards/ReportedHazardsUrql';

type IBoltResults = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  boltNumber: number;
  boltType: string;
  peakLoad: number[];
  peakDisplacement: number[];
  positionInRing: string;
  result: string;
  isHazard: boolean;
  hazardCompletedDate: Date;
  abortReason: string;
  comment: string;
  image: string;
  siteId: string;
  levelId: string;
  driveId: string;
  locationId: string;
  userId: string;
  // companyId: string // this should be here so we can filter on the companyId
};

const capitalizeFirstLetter = (text: string | null | undefined): string => {
  if (!text) return 'N/A';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const generateBoltSpecifications = (boltData: IBoltResults) => {
  return [
    {
      title: 'Site',
      text: boltData.siteId || 'N/A',
    },
    {
      title: 'Bolt',
      text: boltData.boltNumber?.toString() || 'N/A',
    },
    {
      title: 'Bolt type',
      text: boltData.boltType || 'N/A',
    },
    {
      title: 'Level',
      text: boltData.levelId || 'N/A',
    },
    {
      title: 'Drive',
      text: boltData.driveId || 'N/A',
    },
    {
      title: 'Location',
      text: boltData.locationId || 'N/A',
    },
    {
      title: 'Position in ring',
      text: boltData.positionInRing || 'N/A',
    },
    {
      title: 'Result',
      text: capitalizeFirstLetter(boltData.result) || 'N/A',
    },
    {
      title: 'Abort Reason',
      text: boltData.abortReason || 'N/A',
    },
  ];
};

export default function Page(): JSX.Element {
  const { boltResults } = useBoltResults();

  // const displayData = boltResults && boltResults.length > 0 ? boltResults : boltResultsMock;

  console.log('FROM BACKEND', boltResults);

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
          {boltResults?.map(
            (boltResult, index) =>
              boltResult.isHazard && (
                <HazardCard
                  key={index}
                  isHazard={boltResult.isHazard}
                  fullBoltData={boltResult}
                  dateTitle={boltResult.createdAt}
                  boltInfoItems={generateBoltSpecifications(boltResult)}
                  boltDescription={boltResult.comment}
                />
              ),
          )}
        </TabsContent>
        <TabsContent
          value="completed"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {boltResults?.map(
            (boltResult, index) =>
              !boltResult.isHazard && (
                <HazardCard
                  key={index}
                  isHazard={boltResult.isHazard}
                  fullBoltData={boltResult}
                  dateTitle={boltResult.createdAt}
                  boltInfoItems={boltSpecifications}
                  boltDescription={boltResult.comment}
                />
              ),
          )}
        </TabsContent>
        <TabsContent
          value="view all"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {boltResults?.map((boltResult, index) => (
            <HazardCard
              key={index}
              isHazard={boltResult.isHazard}
              fullBoltData={boltResult}
              dateTitle={boltResult.createdAt}
              boltInfoItems={boltSpecifications}
              boltDescription={boltResult.comment}
            />
          ))}
        </TabsContent>
      </Tabs>
    </main>
  );
}
