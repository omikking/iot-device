'use client';

import { BoltResultsFilter } from '@/components/BoltResultsFilter';
import { Headline } from '@gsp/ui';
import { HazardCard } from '@/components/HazardCard';
import { hazardCardMock } from '@/app/mock/mock';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-start gap-12 min-h-screen p-24 ">
      <Headline variant="xl" as="h1" color="foreground">
        Design system - Pull Test Portal 🦄
      </Headline>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Bolt results filter 🦄
      </Headline>
      <div className="flex flex-row flex-wrap justify-center gap-12">
        <BoltResultsFilter />
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Hazard card 🦄
      </Headline>
      <div className="flex flex-row flex-wrap justify-center gap-12">
        {hazardCardMock.map(
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
      </div>

      <hr className="w-full" />
    </main>
  );
}
