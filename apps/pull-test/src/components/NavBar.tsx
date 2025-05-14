'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { Headline, Typography } from '@gsp/ui';
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
    <header className="px-10 h-16 flex flex-row justify-between border-b-[2px] border-gold-3">
      <nav className="w-full flex flex-row justify-between items-center">
        <Link href="/overview">
          <SandvikLogo />
        </Link>

        <div className="flex gap-10 items-center">
          <Headline variant="small" color="foreground" as="h3" isBold>
            Pull Test Portal
          </Headline>

          {status === 'authenticated' && (
            <div className="flex items-center gap-2">
              <div className="border border-gold-3 px-5 py-1.5">
                <Typography variant="medium" color="foreground">
                  {session.company.name}
                </Typography>
              </div>

              <div className="flex items-center gap-1 border border-gold-3 px-5 py-1.5">
                <LucideUser size="16" className="mr-2" />
                <Typography variant="medium" color="foreground">
                  {session.user.fullName}
                </Typography>
              </div>
            </div>
          )}

          {!isExcludedPath && status === 'authenticated' && <Menu />}
        </div>
      </nav>
    </header>
  );
};
