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

const getCompanyName = graphql(`
  query getCompanyName($id: String!) {
    company(id: $id) {
      id
      name
    }
  }
`);

export const Menu = () => {
  // @TODO fix colors on icons
  const { data: session } = useSession();
  const sessionCompanyId = session?.company?.id;

  const params = useParams();
  const companyId = params?.id as string;

  const [companyResult] = useQuery({
    query: getCompanyName,
    variables: { id: companyId },
  });
  const companyName = companyResult.data?.company?.name;

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

              <div className="flex flex-col gap-1">
                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Link href={`/overview/${companyId}`} passHref legacyBehavior>
                    <Anchor color="foreground">
                      <LucideMoveRight className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      Overview
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
                    href={`/boltresults/${companyId}`}
                    passHref
                    legacyBehavior
                  >
                    <Anchor color="foreground">
                      <LucideMoveRight className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      View bolt results
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
                    href={`/reportedhazards/${companyId}`}
                    passHref
                    legacyBehavior
                  >
                    <Anchor color="foreground">
                      <LucideMoveRight className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      View reported hazards
                    </Anchor>
                  </Link>
                </Headline>
              </div>

              <hr className="border-neutral-2" />
            </>
          )}

          <div className="flex flex-col gap-1 mb-16">
            <Headline variant="medium" color="foreground" as="h3">
              <Link
                href={`http://localhost:3000/selectapplication/${sessionCompanyId}`}
                passHref
                legacyBehavior
              >
                <Anchor color="foreground">
                  <LucideLayoutGrid className="text-orange-600" />
                  Browse apps
                </Anchor>
              </Link>
            </Headline>

            <Headline variant="medium" color="foreground" as="h3">
              <Link
                href="http://localhost:3000/accountsettings"
                passHref
                legacyBehavior
              >
                <Anchor color="foreground">
                  <LucideSettings />
                  Account settings
                </Anchor>
              </Link>
            </Headline>

            <Button
              className="mt-4"
              variant="outline"
              size="large"
              tabIndex={-1}
              onClick={() => signOut()}
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
