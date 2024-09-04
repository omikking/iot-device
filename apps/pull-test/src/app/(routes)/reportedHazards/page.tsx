'use client';
import React from 'react';
import {
  Anchor,
  Headline,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@gsp/ui';
import Link from 'next/link';
import { LucideMoveLeft } from 'lucide-react';
import { HazardCard } from '@/components/HazardCard';
import { hazardCardsMock } from '@/app/mock/mock';

export default function Page(): JSX.Element {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <Headline
        variant="xl"
        as="h1"
        color="foreground"
        className="md:text-center px-10"
      >
        Reported hazards
      </Headline>

      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10 group"
      >
        <Link href="/" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-[-4px]" />
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
          {hazardCardsMock.map(
            (hazardCard, index) =>
              hazardCard.isHazard && (
                <HazardCard
                  key={index}
                  dateTitle={hazardCard.dateTitle}
                  isHazard={hazardCard.isHazard}
                  boltInfoItems={hazardCard.boltSpecifications}
                  boltDescription={hazardCard.boltDescription}
                />
              ),
          )}
        </TabsContent>
        <TabsContent value="completed" className="flex flex-wrap gap-8">
          {hazardCardsMock.map(
            (hazardCard, index) =>
              !hazardCard.isHazard && (
                <HazardCard
                  key={index}
                  dateTitle={hazardCard.dateTitle}
                  isHazard={hazardCard.isHazard}
                  boltInfoItems={hazardCard.boltSpecifications}
                  boltDescription={hazardCard.boltDescription}
                />
              ),
          )}
        </TabsContent>
        <TabsContent value="view all" className="flex flex-wrap gap-8">
          {hazardCardsMock.map((hazardCard, index) => (
            <HazardCard
              key={index}
              dateTitle={hazardCard.dateTitle}
              isHazard={hazardCard.isHazard}
              boltInfoItems={hazardCard.boltSpecifications}
              boltDescription={hazardCard.boltDescription}
            />
          ))}
        </TabsContent>
      </Tabs>
    </main>
  );
}
