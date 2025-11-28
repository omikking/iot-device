'use client';;
import { BoltResultsFilter } from '@/components/BoltResultsFilter';
import { Headline } from '@gsp/ui';
import { HazardCard } from '@/components/HazardCard';
import { boltResultDesignSystemMock } from '@/app/mock/mock';

import type { JSX } from "react";

export default function Page(): JSX.Element {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <Headline variant="xl" as="h1" color="foreground">
        Design system - Pull Test 🦄
      </Headline>

      <hr className="w-full border-neutral-2" />

      <Headline variant="large" as="h1" color="foreground">
        Bolt results filter 🦄
      </Headline>
      <div className="flex flex-row flex-wrap justify-center gap-12">
        <BoltResultsFilter
          onFilterChange={() => console.log('filter change')}
        />
      </div>

      <hr className="w-full border-neutral-2" />

      <Headline variant="large" as="h1" color="foreground">
        Hazard card 🦄
      </Headline>
      <div className="w-full flex flex-row flex-wrap justify-center gap-12">
        {boltResultDesignSystemMock.map(
          (hazardCard, index) =>
            hazardCard.isHazard && (
              <HazardCard
                key={index}
                boltResult={hazardCard}
                onViewMore={() => console.log('opens modal')}
              />
            ),
        )}
      </div>

      <hr className="w-full border-neutral-2" />
    </main>
  );
}
