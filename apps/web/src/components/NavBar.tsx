'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { Headline, Text } from '@gsp/ui';
import { LucideUser } from 'lucide-react';
import { Menu } from './Menu';
import Link from 'next/link';
import { SandvikLogo } from 'public/SandvikLogo';
import { useRouter } from 'next/navigation';

// Export to ui component
export { useRouter };

export const NavBar = () => {
  const { data: session, status } = useSession();

  return (
    <header className="px-10 h-16 flex flex-row justify-between border-b-[2px] border-gold-3">
      <nav className="w-full flex flex-row justify-between items-center">
        <Link href="/">
          <SandvikLogo />
        </Link>

        <div className="flex gap-10 items-center">
          <Headline variant="smallBold" color="foreground" as="h3">
            Ground Support Platform
          </Headline>

          {status === 'authenticated' && (
            <div className="flex items-center gap-2">
              <div className="border border-gold-3 px-5 py-1.5">
                <Text variant="medium" color="foreground">
                  Ecorp
                </Text>
              </div>

              <div className="flex items-center gap-1 border border-gold-3 px-5 py-1.5">
                <LucideUser size="16" className="mr-2" />
                <Text variant="medium" color="foreground">
                  {session.userData.firstName} {session.userData.lastName}
                </Text>
              </div>
            </div>
          )}

          <Menu />
        </div>
      </nav>
    </header>
  );
};
