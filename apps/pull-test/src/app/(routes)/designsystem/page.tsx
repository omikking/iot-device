'use client';

import { BoltResultsFilter } from '@/components/BoltResultsFilter';
import { Headline } from '@gsp/ui';
import { HazardCard } from '@/components/HazardCard';

export default function Page(): JSX.Element {
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
  ];

  const hazardCardsData = [
    {
      dateTitle: '2021-05-23',
      isHazard: true,
      viewBoltSpecifications,
      boltDescription: 'Bolt could not be tested...',
    },
  ];

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
      </div>

      <hr className="w-full" />
    </main>
  );
}
