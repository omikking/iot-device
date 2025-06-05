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
  LucidePlus,
  LucideSettings,
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
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
  const role = session?.user?.globalRole;

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
          {companyId && <MenuTitle>{companyName}</MenuTitle>}

          {!companyId && role === Role.SandvikAdmin && (
            <Link href="/overview" passHref legacyBehavior>
              <Button
                className="mt-4"
                variant="secondary"
                size="large"
                tabIndex={-1}
              >
                <LucideBuilding2 />
                Select company
              </Button>
            </Link>
          )}

          {companyId && (
            <div className="flex flex-col gap-1">
              <Headline
                variant="medium"
                color="foreground"
                as="h3"
                className="group"
              >
                <Link href={`/users/${companyId}`} passHref legacyBehavior>
                  <Anchor color="foreground">
                    <LucideMoveRight className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5" />
                    View users
                  </Anchor>
                </Link>
              </Headline>

              <Headline
                variant="medium"
                color="foreground"
                as="h3"
                className="group"
              >
                <Link href={`/sites/${companyId}`} passHref legacyBehavior>
                  <Anchor color="foreground">
                    <LucideMoveRight className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5" />
                    View sites
                  </Anchor>
                </Link>
              </Headline>

              <Headline
                variant="medium"
                color="foreground"
                as="h3"
                className="group"
              >
                <Link href="/sitelocations/all" passHref legacyBehavior>
                  <Anchor color="foreground">
                    <LucideMoveRight className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5" />
                    View site locations
                  </Anchor>
                </Link>
              </Headline>

              <Link
                href={
                  role === Role.SandvikAdmin ? '/overview' : '/selectcompany'
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
            </div>
          )}

          <hr className="border-neutral-2" />

          <div className="flex flex-col gap-1">
            <Headline
              variant="medium"
              color="foreground"
              as="h3"
              className="group"
            >
              <Link href="/overview" passHref legacyBehavior>
                <Anchor color="foreground">
                  <LucideMoveRight className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5" />
                  Overview
                </Anchor>
              </Link>
            </Headline>

            {role === Role.SandvikAdmin && (
              <>
                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Link href="/technicians" passHref legacyBehavior>
                    <Anchor color="foreground">
                      <LucideMoveRight className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      View technicians
                    </Anchor>
                  </Link>
                </Headline>

                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Link href="company/new" passHref legacyBehavior>
                    <Anchor color="foreground">
                      <LucidePlus className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:rotate-90" />
                      Add new company
                    </Anchor>
                  </Link>
                </Headline>
              </>
            )}
          </div>

          <hr className="border-neutral-2" />

          <div className="flex flex-col gap-1 mb-16">
            <Headline variant="medium" color="foreground" as="h3">
              <Link
                href={`/selectapplication/${sessionCompanyId}`}
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
              <Link href="/accountsettings" passHref legacyBehavior>
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
