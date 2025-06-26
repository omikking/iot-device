'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { Headline, Text } from '@gsp/ui';
import { LucideUser } from 'lucide-react';
import { SandvikLogo } from 'public/SandvikLogo';
import { Menu } from './Menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavBar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const excludedPaths = ['/api/auth/signin', '/forgot-password'];
  const isExcludedPath = excludedPaths.includes(pathname);

  return (
    <header className="px-10 h-16 flex flex-row justify-between border-b border-gold-3">
      <nav className="w-full flex flex-row justify-between items-center">
        <Link href="/overview">
          <div className="flex items-center justify-center gap-2">
            <SandvikLogo />
            <div className="h-6 border-l border-black mx-1" />
            <Headline variant="small" color="foreground" as="h3" isBold>
              Pull Test
            </Headline>
          </div>
        </Link>

        <div className="flex gap-10 items-center">
          {status === 'authenticated' && (
            <div className="flex items-center gap-2">
              <div className="border border-gold-3 px-5 py-1.5">
                <Text variant="medium" color="foreground">
                  {session.company.name}
                </Text>
              </div>

              <div className="flex items-center gap-1 border border-gold-3 px-5 py-1.5">
                <LucideUser size="16" className="mr-2" />
                <Text variant="medium" color="foreground">
                  {session.user.fullName}
                </Text>
              </div>
            </div>
          )}

          {!isExcludedPath && status === 'authenticated' && <Menu />}
        </div>
      </nav>
    </header>
  );
};
