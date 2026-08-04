'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { Headline, Text } from '@gsp/ui';
import { LucideUser } from 'lucide-react';
import { SandvikLogo } from 'public/SandvikLogo';
import { Menu } from './Menu';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { getAppName } from '@/libs/utils';
import { Application } from '@/gql/graphql';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

const getCompanyName = graphql(`
  query getCompanyName($id: String!) {
    company(id: $id) {
      id
      name
    }
  }
`);

export const NavBar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const params = useParams();
  const companyId = params?.id as string;

  const [{ data }] = useQuery({
    query: getCompanyName,
    variables: { id: companyId },
    pause: !companyId,
  });
  const companyName = data?.company?.name;

  const excludedPaths = [
    '/api/auth/signin',
    '/forgot-password',
    '/setup-account',
  ];
  const isExcludedPath = excludedPaths.includes(pathname);

  return (
    <header className="px-4 sm:px-6 lg:px-10 h-16 flex flex-row justify-between border-b border-gold-3">
      <nav className="w-full flex flex-row justify-between items-center gap-2 min-w-0">
        <Link href={`/overview/${companyId}`} className="flex-shrink-0">
          <div className="flex items-center justify-center gap-2">
            <SandvikLogo />
            <div className="hidden sm:block h-6 border-l border-black mx-1" />
            <Headline
              variant="small"
              color="foreground"
              as="h3"
              isBold
              className="hidden sm:block whitespace-nowrap"
            >
              {getAppName(Application.PullTest)}
            </Headline>
          </div>
        </Link>

        <div className="flex gap-2 sm:gap-4 lg:gap-10 items-center min-w-0">
          {status === 'authenticated' && (
            <div className="flex items-center gap-2 min-w-0">
              {companyName && (
                <div className="hidden md:flex items-center border border-gold-3 px-3 lg:px-5 py-1.5 max-w-[10rem] lg:max-w-xs">
                  <Text
                    variant="medium"
                    color="foreground"
                    className="truncate"
                  >
                    {companyName}
                  </Text>
                </div>
              )}

              <div className="flex items-center gap-1 border border-gold-3 px-3 sm:px-5 py-1.5 min-w-0">
                <LucideUser size={16} className="mr-2 flex-shrink-0" />
                <Text
                  variant="medium"
                  color="foreground"
                  className="hidden sm:block truncate max-w-[8rem] lg:max-w-xs"
                >
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
