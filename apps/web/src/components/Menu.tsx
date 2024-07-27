'use client';
import React from 'react';

import {
  Button,
  Headline,
  Link,
  MenuWrapper,
  MenuContent,
  MenuTrigger,
  MenuTitle,
} from '@gsp/ui';
import {
  LucideBuilding2,
  LucideLayoutGrid,
  LucideLogIn,
  LucideLogOut,
  LucideMenu,
  LucideMoveRight,
  LucidePlus,
  LucideSettings,
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';

export const Menu = () => {
  //   @TODO fix colors on icons
  const { data: session, status } = useSession();
  console.log(session);

  return (
    <MenuWrapper>
      <MenuTrigger asChild>
        <LucideMenu
          size="30"
          className="cursor-pointer data-[state=open]:opacity-0 data-[state=closed]:opacity-1 transition-all duration-200"
        />
      </MenuTrigger>

      <MenuContent>
        <div className="flex ui-flex-col gap-10">
          {status === 'authenticated' && (
            <>
              <MenuTitle>Garpenberg</MenuTitle>

              <div className="flex ui-flex-col gap-1">
                <Headline variant="medium" color="foreground" as="h3">
                  <Link href="#" color="foreground">
                    <LucideMoveRight />
                    View users
                  </Link>
                </Headline>

                <Headline variant="medium" color="foreground" as="h3">
                  <Link href="#" color="foreground">
                    <LucideMoveRight />
                    View sites
                  </Link>
                </Headline>

                <Headline variant="medium" color="foreground" as="h3">
                  <Link href="#" color="foreground">
                    <LucideMoveRight />
                    View site locations
                  </Link>
                </Headline>

                <Button
                  className="mt-4"
                  variant="secondary"
                  size="large"
                  tabIndex={-1}
                >
                  <LucideBuilding2 size="20" />
                  Change company
                </Button>
              </div>

              <hr className="ui-text-gold-3" />

              <div className="flex ui-flex-col gap-1">
                <Headline variant="medium" color="foreground" as="h3">
                  <Link href="#" color="foreground">
                    <LucideMoveRight />
                    Overview
                  </Link>
                </Headline>

                <Headline variant="medium" color="foreground" as="h3">
                  <Link href="#" color="foreground">
                    <LucideMoveRight />
                    View global technicians
                  </Link>
                </Headline>

                <Headline variant="medium" color="foreground" as="h3">
                  <Link href="#" color="foreground">
                    <LucidePlus />
                    Add new company
                  </Link>
                </Headline>
              </div>

              <hr className="ui-text-gold-3" />
            </>
          )}

          <div className="flex ui-flex-col gap-1">
            <Headline variant="medium" color="foreground" as="h3">
              <Link href="#" color="foreground">
                <LucideLayoutGrid className="text-orange-600" />
                Browse apps
              </Link>
            </Headline>

            <Headline variant="medium" color="foreground" as="h3">
              <Link href="#" color="foreground">
                <LucideSettings />
                Settings
              </Link>
            </Headline>

            {status === 'authenticated' ? (
              <Button
                className="mt-4"
                variant="outline"
                size="large"
                tabIndex={-1}
                onClick={() => signOut()}
              >
                <LucideLogOut size="20" />
                Logout
              </Button>
            ) : (
              <Button
                className="mt-4"
                variant="primary"
                size="large"
                tabIndex={-1}
                onClick={() => signIn()}
              >
                <LucideLogIn size="20" />
                Login
              </Button>
            )}
          </div>
        </div>
      </MenuContent>
    </MenuWrapper>
  );
};
