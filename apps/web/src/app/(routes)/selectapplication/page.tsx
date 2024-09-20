'use client';
import { Badge, Headline, NavigationCard } from '@gsp/ui';
import { GoBack } from '@/components/GoBack';
import { SandvikLogo } from 'public/SandvikLogo';

import Link from 'next/link';
import { LucideCircuitBoard } from 'lucide-react';

export default function Page(): JSX.Element {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-neutral-main-white max-w-[1400px]">
      <GoBack />

      <Badge variant="primary" size="large" className="absolute top-24">
        Ecorp AB
      </Badge>

      <Headline as="h1" variant="xl" color="foreground">
        Select Application
      </Headline>

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
          <Link href="/">
            <NavigationCard>
              <div className="flex flex-col items-center h-full gap-6">
                <Headline as="h3" variant="medium" color="foreground">
                  Ultrabots
                </Headline>
                <SandvikLogo />
              </div>
            </NavigationCard>
          </Link>
          <Link href="/">
            <NavigationCard>
              <div className="flex flex-col items-center h-full gap-6">
                <Headline as="h3" variant="medium" color="foreground">
                  xCyclops
                </Headline>
                <SandvikLogo />
              </div>
            </NavigationCard>
          </Link>
        </div>
      </div>

      <div className="flex flex-row justify-around gap-10 max-w-[1000px] w-full pt-20 border-t border-t-gold-3">
        <div className="flex flex-row flex-wrap gap-12 w-full justify-center ">
          <Link href="/">
            <NavigationCard>
              <div className="flex flex-col items-center h-full gap-6">
                <Headline as="h3" variant="medium" color="foreground">
                  Management
                </Headline>
                <LucideCircuitBoard size={56} />
              </div>
            </NavigationCard>
          </Link>
        </div>
      </div>
    </main>
  );
}
