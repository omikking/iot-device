'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { Headline, Text } from '@gsp/ui';
import { LucideUser } from 'lucide-react';
import { Menu } from './Menu';
import Link from 'next/link';
import { SandvikLogo } from 'public/SandvikLogo';
import { usePathname } from 'next/navigation';

export const NavBar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Sry for the name this the best I could come up with
  const excludeMenyList = [
    '/api/auth/signin',
    '/overview', // This one is just to test it works on other pages
    '/forgot-password',
  ];
  const excludeMenyOnNavbar = excludeMenyList.includes(pathname);

  return (
    <header className="px-10 h-16 flex flex-row justify-between border-b-[2px] border-gold-3">
      <nav className="w-full flex flex-row justify-between items-center">
        <Link href="/overview">
          <SandvikLogo />
        </Link>

        <div className="flex gap-10 items-center">
          <Headline variant="small" color="foreground" as="h3" isBold>
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
          {!excludeMenyOnNavbar && <Menu />}
        </div>
      </nav>
    </header>
  );
};
