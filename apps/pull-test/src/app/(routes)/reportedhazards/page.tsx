'use client';
import React from 'react';
import { Headline, Tabs, TabsContent, TabsList, TabsTrigger } from '@gsp/ui';
import { GoBack } from '@/components/GoBack';
import { HazardCard } from '@/components/HazardCard';
import { hazardCardsMock } from '@/app/mock/mock';

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
        <TabsContent
          value="completed"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
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
        <TabsContent
          value="view all"
          className="flex flex-wrap gap-y-8 gap-x-3 justify-between"
        >
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
