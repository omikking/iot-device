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
  LucideLogIn,
  LucideLogOut,
  LucideMenu,
  LucideMoveRight,
  LucideSettings,
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

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
        <div className="flex ui-flex-col gap-8">
          {status === 'authenticated' && (
            <>
              <MenuTitle>Garpenberg</MenuTitle>

              <div className="flex ui-flex-col gap-1">
                <Headline variant="medium" color="foreground" as="h3">
                  <Link href="#" passHref legacyBehavior>
                    <Anchor color="foreground">
                      <LucideMoveRight />
                      Pull-test overview
                    </Anchor>
                  </Link>
                </Headline>

                <Headline variant="medium" color="foreground" as="h3">
                  <Link href="#" passHref legacyBehavior>
                    <Anchor color="foreground">
                      <LucideMoveRight />
                      View bolt results
                    </Anchor>
                  </Link>
                </Headline>

                <Headline variant="medium" color="foreground" as="h3">
                  <Link href="#" passHref legacyBehavior>
                    <Anchor color="foreground">
                      <LucideMoveRight />
                      View reported hazards
                    </Anchor>
                  </Link>
                </Headline>
              </div>

              <hr className="ui-text-gold-3" />
            </>
          )}

          <div className="flex ui-flex-col gap-1">
            <Headline variant="medium" color="foreground" as="h3">
              <Link href="#" passHref legacyBehavior>
                <Anchor color="foreground">
                  <LucideLayoutGrid className="text-orange-600" />
                  Browse apps
                </Anchor>
              </Link>
            </Headline>

            <Headline variant="medium" color="foreground" as="h3">
              <Link href="#" passHref legacyBehavior>
                <Anchor color="foreground">
                  <LucideSettings />
                  Settings
                </Anchor>
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
                <LucideLogOut />
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
                <LucideLogIn />
                Login
              </Button>
            )}
          </div>
        </div>
      </MenuContent>
    </MenuWrapper>
  );
};
