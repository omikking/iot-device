'use client';
import {
  Anchor,
  HazardCard,
  Headline,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@gsp/ui';
import {
  LucideGitGraph,
  LucideGrid3X3,
  LucideList,
  LucideMoveLeft,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const boltInfoItems = [
  { title: 'Diameter', text: '66.40 cm' },
  { title: 'Pass Criteria', text: 'N/A' },
  {
    title: 'Location',
    text: 'Södra Larmgatan 4, 411 16 Göteborg, Sweden',
  },
];
export default function Page(): JSX.Element {
  return (
    <main className="">
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
        <Link href="#" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft size="20" />
            Go back
          </Anchor>
        </Link>
      </Text>

      <Tabs
        defaultValue="active"
        className="flex max-w-[1400px] flex-col mx-auto gap-4 px-10"
      >
        <TabsList className="self-start">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="view all">View all</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="flex flex-wrap gap-8">
          <HazardCard
            dateTitle="2021-05-23"
            isHazard
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
          <HazardCard
            dateTitle="2021-05-23"
            isHazard
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
          <HazardCard
            dateTitle="2021-05-23"
            isHazard
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
          <HazardCard
            dateTitle="2021-05-23"
            isHazard
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
          <HazardCard
            dateTitle="2021-05-23"
            isHazard
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
        </TabsContent>
        <TabsContent value="completed" className="flex flex-wrap gap-8">
          <HazardCard
            dateTitle="2021-05-23"
            isHazard={false}
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
          <HazardCard
            dateTitle="2021-05-23"
            isHazard={false}
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could be tested!!!!"
          />
          <HazardCard
            dateTitle="2021-05-23"
            isHazard={false}
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
        </TabsContent>
        <TabsContent value="view all">Tab 3 content here</TabsContent>
      </Tabs>
    </main>
  );
}
