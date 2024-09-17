import { GoBack } from '@/components/GoBack';
import { Headline } from '@gsp/ui';
import { SiteResultScehma, siteResultMock } from '@/app/mock/mock';
import React from 'react';

export default function Page(): JSX.Element {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <GoBack />

      <Headline as="h1" variant="xl" color="foreground">
        Sites
      </Headline>
    </main>
  );
}
