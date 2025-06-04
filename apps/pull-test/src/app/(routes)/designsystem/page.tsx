'use client';

import { BoltResultsFilter } from '@/components/BoltResultsFilter';
import { Headline } from '@gsp/ui';
import { HazardCard } from '@/components/HazardCard';
import { mockBoltResult } from '@/app/mock/mock';

export default function Page(): JSX.Element {
  // @TODO: Add filtering functionality, this is essentially a visual mockup currently.
  // Mock filter function
  const mockFilterChange = (filters: unknown) => {
    console.log('Filters changed:', filters);
  };

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <Headline variant="xl" as="h1" color="foreground">
        Design system - Pull Test Portal 🦄
      </Headline>

      <hr className="w-full border-neutral-2" />

      <Headline variant="large" as="h1" color="foreground">
        Bolt results filter 🦄
      </Headline>
      <div className="flex flex-row flex-wrap justify-center gap-12">
        <BoltResultsFilter onFilterChange={mockFilterChange} />
      </div>

      <hr className="w-full border-neutral-2" />

      <Headline variant="large" as="h1" color="foreground">
        Hazard card 🦄
      </Headline>
      <div className="w-full flex flex-row flex-wrap justify-center gap-12">
        {mockBoltResult.map(
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
