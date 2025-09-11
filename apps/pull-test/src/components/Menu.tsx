'use client';
import React from 'react';

import {
  Button,
  Headline,
  Anchor,
  MenuWrapper,
  MenuContent,
  MenuTrigger,
  MenuTitle,
} from '@gsp/ui';
import {
  LucideBuilding2,
  LucideLayoutGrid,
  LucideLogOut,
  LucideMenu,
  LucideMoveRight,
  LucideSettings,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { Role } from '@/gql/graphql';

const getCompanyName = graphql(`
  query getCompanyName($id: String!) {
    company(id: $id) {
      id
      name
    }
  }
`);

const getAllCompaniesQuery = graphql(`
  query GetAllCompanies($offset: Int, $limit: Int) {
    companies(offset: $offset, limit: $limit) {
      totalRecords
      results {
        id
        name
      }
    }
  }
`);

export const Menu = () => {
  // @TODO fix colors on icons
  const { data: session } = useSession();
  const globalRole = session?.user?.globalRole;

  const params = useParams();
  const paramCompanyId = params?.id as string;

  const [companyResult] = useQuery({
    query: getCompanyName,
    variables: { id: paramCompanyId },
    pause: !paramCompanyId,
  });
  const { id: companyId, name: companyName } =
    companyResult.data?.company || {};

  const [{ data }] = useQuery({
    query: getAllCompaniesQuery,
    variables: {
      offset: 0,
      limit: 100,
    },
  });
  const companiesWithAccess = data?.companies?.results || [];

  return (
    <MenuWrapper>
      <MenuTrigger asChild>
        <LucideMenu
          size="30"
          className="cursor-pointer data-[state=open]:opacity-0 data-[state=closed]:opacity-1 transition-all duration-200"
        />
      </MenuTrigger>

      <MenuContent>
        <div className="flex flex-col gap-8">
          {companyId && (
            <>
              <MenuTitle>{companyName}</MenuTitle>

              <div className="flex flex-col gap-1.5">
                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Link href={`/overview/${companyId}`} passHref legacyBehavior>
                    <Anchor color="foreground">
                      <LucideMoveRight className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      Pull Test Overview
                    </Anchor>
                  </Link>
                </Headline>

                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Link
                    href={`/bolt-results/${companyId}`}
                    passHref
                    legacyBehavior
                  >
                    <Anchor color="foreground">
                      <LucideMoveRight className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      Bolt results
                    </Anchor>
                  </Link>
                </Headline>

                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Link
                    href={`/reported-hazards/${companyId}`}
                    passHref
                    legacyBehavior
                  >
                    <Anchor color="foreground">
                      <LucideMoveRight className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      Reported hazards
                    </Anchor>
                  </Link>
                </Headline>

                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Link
                    href={`http://localhost:3000/select-application/${companyId}`}
                    passHref
                    legacyBehavior
                  >
                    <Anchor color="foreground">
                      <LucideLayoutGrid className="text-orange-600 transition-all ease-in-out group-hover:rotate-45" />
                      Browse apps
                    </Anchor>
                  </Link>
                </Headline>

                {(globalRole === Role.SandvikAdmin ||
                  companiesWithAccess.length > 1) && (
                  <Link
                    href={
                      globalRole === Role.SandvikAdmin
                        ? 'http://localhost:3000/administration-portal'
                        : 'http://localhost:3000/select-company'
                    }
                    passHref
                    legacyBehavior
                  >
                    <Button
                      className="mt-4"
                      variant="secondary"
                      size="large"
                      tabIndex={-1}
                    >
                      <LucideBuilding2 />
                      Change company
                    </Button>
                  </Link>
                )}
              </div>

              <hr className="border-neutral-2" />
            </>
          )}

          <div className="flex flex-col gap-1.5 mb-16">
            <Headline
              variant="medium"
              color="foreground"
              as="h3"
              className="group"
            >
              <Link
                href="http://localhost:3000/account-settings"
                passHref
                legacyBehavior
              >
                <Anchor color="foreground">
                  <LucideSettings className="transition-all ease-in-out group-hover:rotate-180" />
                  Account settings
                </Anchor>
              </Link>
            </Headline>

            <Button
              className="mt-4"
              variant="outline"
              size="large"
              tabIndex={-1}
              onClick={() => signOut({ callbackUrl: '/api/auth/signin' })}
            >
              <LucideLogOut />
              Logout
            </Button>
          </div>
        </div>
      </MenuContent>
    </MenuWrapper>
  );
};
