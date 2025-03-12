'use client';
import { Button, Headline, NavigationCard } from '@gsp/ui';
import {
  LucideMountain,
  LucideMoveRight,
  LucidePyramid,
  LucideUsers,
} from 'lucide-react';
import Link from 'next/link';

export const CompanyNavigationCards = () => {
  return (
    <>
      <div className="flex gap-8">
        <NavigationCard>
          <Headline as="h3" variant="medium" color="foreground">
            Users
          </Headline>
          <LucideUsers />
          <Button variant="secondary" size="small" asChild>
            <Link href="/users">
              <LucideMoveRight />
              View users
            </Link>
          </Button>
        </NavigationCard>

        <NavigationCard>
          <Headline as="h3" variant="medium" color="foreground">
            Sites
          </Headline>
          <LucideMountain />
          <Button variant="secondary" size="small" asChild>
            <Link href="/sites">
              <LucideMoveRight />
              View sites
            </Link>
          </Button>
        </NavigationCard>

        <NavigationCard>
          <Headline as="h3" variant="medium" color="foreground">
            Site locations
          </Headline>
          <LucidePyramid />
          <Button variant="secondary" size="small" asChild>
            <Link href="/sitelocations">
              <LucideMoveRight />
              View site locations
            </Link>
          </Button>
        </NavigationCard>
      </div>

      <hr className="w-full border-neutral-2" />
    </>
  );
};
