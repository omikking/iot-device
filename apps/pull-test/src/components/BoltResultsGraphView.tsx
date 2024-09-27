import { Headline, NavigationCard } from '@gsp/ui';
import Link from 'next/link';
import { SandvikLogo } from 'public/SandvikLogo';
import React from 'react';

export const BoltResultsGraphView = () => {
  return (
    <div className="flex flex-row justify-around gap-10 max-w-[1000px] w-full pt-20 border-t border-t-gold-3">
      <div className="flex flex-row flex-wrap gap-12 w-full justify-center ">
        <Link href="/">
          <NavigationCard>
            <div className="flex flex-col items-center h-full gap-6">
              <Headline as="h3" variant="medium" color="foreground">
                Pull-Test
              </Headline>
              <SandvikLogo />
            </div>
          </NavigationCard>
        </Link>
      </div>
    </div>
  );
};
