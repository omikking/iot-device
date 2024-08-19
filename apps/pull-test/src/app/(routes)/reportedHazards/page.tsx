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
    <main className="flex flex-col items-center justify-center w-full gap-12 min-h-screen p-24 ">
      <Headline variant="xl" as="h1" color="foreground">
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
        className=""
        // className="flex flex-col items-center justify-center gap-12"
      >
        <TabsList className=" start-0 self-start justify-start">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="view all">View all</TabsTrigger>
        </TabsList>
        <TabsContent
          value="active"
          className="flex flex-row items-center flex-wrap gap-12"
        >
          {/* <div>1</div>
              <div>2</div>
              <div>3</div> */}
          <HazardCard
            dateTitle="2021-05-23"
            isHazard={true}
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
          <HazardCard
            dateTitle="2021-05-23"
            isHazard={true}
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
          <HazardCard
            dateTitle="2021-05-23"
            isHazard={true}
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
          <HazardCard
            dateTitle="2021-05-23"
            isHazard={true}
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
          <HazardCard
            dateTitle="2021-05-23"
            isHazard={true}
            boltInfoItems={boltInfoItems}
            boltDescription="Bolt could not be tested..."
          />
        </TabsContent>
        <TabsContent value="completed">Tab 2 content here</TabsContent>
        <TabsContent value="view all">Tab 3 content here</TabsContent>
      </Tabs>
    </main>
  );
}
