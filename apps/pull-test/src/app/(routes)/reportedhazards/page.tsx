'use client';
import { Headline, Tabs, TabsContent, TabsList, TabsTrigger } from '@gsp/ui';

import { HazardCard } from '@/components/HazardCard';
import React from 'react';
import { GoBack } from '@/components/GoBack';

const viewBoltSpecifications = [
  {
    title: 'Bolt type',
    text: 'MD47',
  },
  {
    title: 'Peak load',
    text: '15',
  },
  {
    title: 'Displacement',
    text: '19mm',
  },
  {
    title: 'Level',
    text: 'DOV 33 W',
  },
  {
    title: 'Drive',
    text: 'COS 1842',
  },
  {
    title: 'Position in ring',
    text: 'L/H Shoulder',
  },
];

const hazardCardsData = [
  {
    dateTitle: '2021-05-23',
    isHazard: true,
    viewBoltSpecifications,
    boltDescription: 'Bolt could not be tested...',
  },
  {
    dateTitle: '2021-08-24',
    isHazard: true,
    viewBoltSpecifications,
    boltDescription:
      'The equipment showed signs of wear, indicating it may need replacement soon.',
  },
  {
    dateTitle: '2021-03-15',
    isHazard: true,
    viewBoltSpecifications,
    boltDescription:
      'A routine inspection revealed significant issues, and the system is not functioning as expected.',
  },
  {
    dateTitle: '2021-10-05',
    isHazard: true,
    viewBoltSpecifications,
    boltDescription:
      'Major scratches were found on the surface that affected the performance.',
  },
  {
    dateTitle: '2021-01-10',
    isHazard: true,
    viewBoltSpecifications,
    boltDescription: 'There was a delay in response time, exchange ASAP.',
  },
  {
    dateTitle: '2021-11-10',
    isHazard: false,
    viewBoltSpecifications,
    boltDescription:
      'All tests were successfully completed, and the component is in optimal condition.',
  },
  {
    dateTitle: '2021-11-20',
    isHazard: false,
    viewBoltSpecifications,
    boltDescription:
      '"Inspection results show no defects; the equipment meets all operational standards.',
  },
  {
    dateTitle: '2021-03-01',
    isHazard: false,
    viewBoltSpecifications,
    boltDescription:
      '"The device has passed all required benchmarks and is ready for use.',
  },
];
export default function Page(): JSX.Element {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-neutral-main-white">
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
          {hazardCardsData.map(
            (hazardCard, index) =>
              hazardCard.isHazard && (
                <HazardCard
                  key={index}
                  dateTitle={hazardCard.dateTitle}
                  isHazard={hazardCard.isHazard}
                  boltInfoItems={hazardCard.viewBoltSpecifications}
                  boltDescription={hazardCard.boltDescription}
                />
              ),
          )}
        </TabsContent>
        <TabsContent
          value="completed"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {hazardCardsData.map(
            (hazardCard, index) =>
              !hazardCard.isHazard && (
                <HazardCard
                  key={index}
                  dateTitle={hazardCard.dateTitle}
                  isHazard={hazardCard.isHazard}
                  boltInfoItems={hazardCard.viewBoltSpecifications}
                  boltDescription={hazardCard.boltDescription}
                />
              ),
          )}
        </TabsContent>
        <TabsContent
          value="view all"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
          {hazardCardsData.map((hazardCard, index) => (
            <HazardCard
              key={index}
              dateTitle={hazardCard.dateTitle}
              isHazard={hazardCard.isHazard}
              boltInfoItems={hazardCard.viewBoltSpecifications}
              boltDescription={hazardCard.boltDescription}
            />
          ))}
        </TabsContent>
      </Tabs>
    </main>
  );
}
