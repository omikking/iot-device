'use client';
import {
  Anchor,
  Headline,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@gsp/ui';
import { LucideMoveLeft } from 'lucide-react';
import Link from 'next/link';
import { HazardCard } from '@/components/HazardCard';
import React from 'react';

const viewBoltSpecifications = [
  {
    title: 'Diameter',
    text: '66.40 cm',
  },
  {
    title: 'Pass Criteria',
    text: 'N/A',
  },
  {
    title: 'Location',
    text: 'Södra Larmgatan 4, 411 16 Göteborg, Sweden',
  },
  {
    title: 'Bit Size',
    text: '22GAV',
  },
  {
    title: 'Bore Depth',
    text: '20mm',
  },
  {
    title: 'Rotations',
    text: '500',
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
    <main>
      <Headline
        variant="xl"
        as="h1"
        color="foreground"
        className="md:text-center mt-32 mb-20 px-10"
      >
        Reported hazards
      </Headline>

      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10"
      >
        <Link href="/" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft size="20" />
            Go back
          </Anchor>
        </Link>
      </Text>

      <Tabs
        defaultValue="active"
        className="flex max-w-[1400px] flex-col mx-auto pb-10 gap-4 px-10"
      >
        <TabsList className="self-start">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="view all">View all</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="flex flex-wrap gap-8">
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
        <TabsContent value="completed" className="flex flex-wrap gap-8">
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
        <TabsContent value="view all" className="flex flex-wrap gap-8">
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
