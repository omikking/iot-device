'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { GoBack } from '@/components/GoBack';
import { HazardCard } from '@/components/HazardCard';
import { Headline, Tabs, TabsContent, TabsList, TabsTrigger } from '@gsp/ui';
import { useHazardDetails } from '@/components/urql-reportedhazards/HazardsFetchUrql';

type IBoltResultSchema = {
  abortReason?: string;
  boltNumber: number;
  boltType: string;
  comment?: string;
  createdAt: Date;
  driveId: string;
  hazardCompletedDate: Date[];
  id: string;
  image?: string;
  isHazard: boolean;
  levelId: string;
  locationId: string;
  peakDisplacement: number[];
  peakLoad: number[];
  positionInRing: string;
  result: string;
  siteId: string;
  updatedAt: Date;
  userId: string;
};

const capitalizeFirstLetter = (text: string | null | undefined): string => {
  if (!text) return 'N/A';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const generateBoltSpecifications = (
  boltData: IBoltResultSchema,
  names: {
    siteName?: string;
    levelName?: string;
    driveName?: string;
    locationName?: string;
  },
) => {
  return [
    {
      title: 'Site',
      text: names.siteName || 'N/A',
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
      text: names.levelName || 'N/A',
    },
    {
      title: 'Drive',
      text: names.driveName || 'N/A',
    },
    {
      title: 'Location',
      text: names.locationName || 'N/A',
    },
    {
      title: 'Position in ring',
      text: boltData.positionInRing.replaceAll('_', '-') || 'N/A',
    },
    {
      title: 'Result',
      text: capitalizeFirstLetter(boltData.result) || 'N/A',
    },
    {
      title: 'Abort Reason',
      text:
        capitalizeFirstLetter(boltData.abortReason).replaceAll('_', ' ') ||
        'N/A',
    },
  ];
};

export default function Page(): JSX.Element {
  const params = useParams();
  const companyId = params.id as string;

  const { hazards } = useHazardDetails(companyId);

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
          {hazards?.map(
            (boltResult, index) =>
              boltResult.isHazard && (
                <HazardCard
                  key={index}
                  isHazard={boltResult.isHazard}
                  fullBoltData={boltResult}
                  dateTitle={boltResult.createdAt}
                  boltInfoItems={generateBoltSpecifications(boltResult, {})}
                  boltDescription={boltResult.comment}
                />
              ),
          )}
        </TabsContent>
        <TabsContent
          value="completed"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {hazards?.map(
            (boltResult, index) =>
              !boltResult.isHazard && (
                <HazardCard
                  key={index}
                  isHazard={boltResult.isHazard}
                  fullBoltData={boltResult}
                  dateTitle={boltResult.createdAt}
                  boltInfoItems={generateBoltSpecifications(boltResult, {})}
                  boltDescription={boltResult.comment}
                />
              ),
          )}
        </TabsContent>
        <TabsContent
          value="view all"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {hazards?.map((boltResult, index) => (
            <HazardCard
              key={index}
              isHazard={boltResult.isHazard}
              fullBoltData={boltResult}
              dateTitle={boltResult.createdAt}
              boltInfoItems={generateBoltSpecifications(boltResult, {})}
              boltDescription={boltResult.comment}
            />
          ))}
        </TabsContent>
      </Tabs>
    </main>
  );
}
