'use client';
import { Badge, Headline, NavigationCard } from '@gsp/ui';
import { GoBack } from '@/components/GoBack';
import { SandvikLogo } from 'public/SandvikLogo';

import Link from 'next/link';
import { LucideCircuitBoard } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Page(): JSX.Element {
  const { data: session } = useSession();

  return (
    //@TODO  Fix this min-h-[calc(100vh-65px)] add that value in tailwind-config as minPageHeight or something like that
    <main className="w-full min-h-[calc(100vh-65px)] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-1 overflow-y-auto">
      <GoBack />

      {session?.company.name && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {session.company.name}
        </Badge>
      )}

      <Headline as="h1" variant="xl" color="foreground">
        Select Application
      </Headline>

      <div className="flex flex-row justify-around gap-10 max-w-[1000px] pt-20 border-t border-t-neutral-2">
        <div className="flex flex-row gap-12 justify-center">
          <Link href="http://localhost:3001/overview">
            <NavigationCard size={'medium'}>
              <Headline as="h3" variant="medium" color="foreground">
                Pull Test
              </Headline>
              <SandvikLogo />
            </NavigationCard>
          </Link>
          <Link href="http://localhost:3000/designsystem">
            <NavigationCard size={'medium'}>
              <Headline as="h3" variant="medium" color="foreground">
                Ultrabolts
              </Headline>
              <SandvikLogo />
            </NavigationCard>
          </Link>
          <Link href="http://localhost:3000/designsystem">
            <NavigationCard size={'medium'}>
              <Headline as="h3" variant="medium" color="foreground">
                Cyclops
              </Headline>
              <SandvikLogo />
            </NavigationCard>
          </Link>
        </div>
      </div>

      <div className="flex flex-row justify-around gap-10 max-w-[1000px] w-full pt-20 border-t border-t-neutral-2">
        <div className="flex flex-row gap-12 w-full justify-center">
          <Link href="/overview">
            <NavigationCard size={'medium'}>
              <Headline as="h3" variant="medium" color="foreground">
                Management
              </Headline>
              <LucideCircuitBoard size={56} />
            </NavigationCard>
          </Link>
        </div>
      </div>
    </main>
  );
}
