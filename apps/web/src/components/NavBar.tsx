'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Headline, Text } from '@gsp/ui';
import { LucideUser } from 'lucide-react';
import { Menu } from './Menu';
import { SandvikLogo } from 'public/SandvikLogo';
import { useParams, usePathname } from 'next/navigation';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { Role } from '@/gql/graphql';

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
  const paramCompanyId = params?.id as string;

  const [{ data }] = useQuery({
    query: getCompanyName,
    variables: { id: paramCompanyId },
  });
  const companyName = data?.company?.name;

  const excludedPaths = ['/api/auth/signin', '/forgot-password'];
  const isExcludedPath = excludedPaths.includes(pathname);

  return (
    <header className="px-10 h-16 flex flex-row justify-between border-b border-gold-3">
      <nav className="w-full flex flex-row justify-between items-center">
        <Link
          href={
            session?.user.globalRole !== Role.SandvikAdmin
              ? '/selectcompany'
              : '/overview'
          }
        >
          <div className="flex items-center justify-center gap-2">
            <SandvikLogo />
            <div className="h-6 border-l border-black mx-1" />
            <Headline variant="small" color="foreground" as="h3" isBold>
              Ground Support Platform
            </Headline>
          </div>
        </Link>

        <div className="flex gap-10 items-center">
          {status === 'authenticated' && (
            <div className="flex items-center gap-2">
              {companyName && (
                <div className="border border-gold-3 px-5 py-1.5">
                  <Text variant="medium" color="foreground">
                    {companyName}
                  </Text>
                </div>
              )}

              <div className="flex items-center gap-1 border border-gold-3 px-5 py-1.5">
                <LucideUser size="16" className="mr-2" />
                <Text variant="medium" color="foreground">
                  {session?.user?.fullName}
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
