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
          {companyId ? (
            <MenuTitle>{companyName}</MenuTitle>
          ) : (
            // sr-only title for accessibility, but is hidden visually
            <MenuTitle className="sr-only">Menu</MenuTitle>
          )}

          {!companyId && (
            <>
              <Button asChild className="mt-4" variant="secondary" size="large">
                <Link
                  href={
                    globalRole === Role.SandvikAdmin
                      ? '/administration-portal'
                      : '/select-company'
                  }
                >
                  <LucideBuilding2 />
                  Select company
                </Link>
              </Button>
              <hr className="border-neutral-2" />
            </>
          )}

          {companyId && (
            <>
              <hr className="border-neutral-2" />
              <div className="flex flex-col gap-1.5">
                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Anchor asChild color="foreground">
                    <Link href={`/company/${companyId}`}>
                      <LucideMoveRight className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      Company overview
                    </Link>
                  </Anchor>
                </Headline>
              </div>
              <hr className="border-neutral-2" />
            </>
          )}

          {companyId && (
            <>
              <div className="flex flex-col gap-1.5">
                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Anchor asChild color="foreground">
                    <Link href={`/users/${companyId}`}>
                      <LucideMoveRight className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      Users
                    </Link>
                  </Anchor>
                </Headline>

                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Anchor asChild color="foreground">
                    <Link href={`/sites/${companyId}`}>
                      <LucideMoveRight className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      Sites
                    </Link>
                  </Anchor>
                </Headline>

                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Anchor asChild color="foreground">
                    <Link href={`/site-locations/${companyId}`}>
                      <LucideMoveRight className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      Site locations
                    </Link>
                  </Anchor>
                </Headline>

                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Anchor asChild color="foreground">
                    <Link href={`/select-application/${companyId}`}>
                      <LucideLayoutGrid className="text-orange-primary transition-all ease-in-out group-hover:rotate-45" />
                      Browse apps
                    </Link>
                  </Anchor>
                </Headline>

                {(globalRole === Role.SandvikAdmin ||
                  companiesWithAccess.length > 1) && (
                  <Button
                    asChild
                    className="mt-4"
                    variant="secondary"
                    size="large"
                  >
                    <Link
                      href={
                        globalRole === Role.SandvikAdmin
                          ? '/administration-portal'
                          : '/select-company'
                      }
                    >
                      <LucideBuilding2 />
                      Change company
                    </Link>
                  </Button>
                )}
              </div>
              <hr className="border-neutral-2" />
            </>
          )}

          {globalRole === Role.SandvikAdmin && (
            <>
              <div className="flex flex-col gap-1.5">
                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Anchor asChild color="foreground">
                    <Link href="/administration-portal">
                      <LucideMoveRight className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      Administration Portal
                    </Link>
                  </Anchor>
                </Headline>

                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Anchor asChild color="foreground">
                    <Link href="/administrators">
                      <LucideMoveRight className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      Administrators
                    </Link>
                  </Anchor>
                </Headline>

                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Anchor asChild color="foreground">
                    <Link href="/technicians">
                      <LucideMoveRight className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5" />
                      Technicians
                    </Link>
                  </Anchor>
                </Headline>

                <Headline
                  variant="medium"
                  color="foreground"
                  as="h3"
                  className="group"
                >
                  <Anchor asChild color="foreground">
                    <Link href="/company/new">
                      <LucidePlus className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:rotate-90" />
                      Add new company
                    </Link>
                  </Anchor>
                </Headline>
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
              <Anchor asChild color="foreground">
                <Link href="/account-settings">
                  <LucideSettings className="transition-all ease-in-out group-hover:rotate-180" />
                  Account settings
                </Link>
              </Anchor>
            </Headline>

            <Button
              className="mt-4"
              variant="outline"
              size="large"
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
