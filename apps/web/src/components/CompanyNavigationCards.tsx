'use client';
import { Button, Headline, NavigationCard } from '@gsp/ui';
import {
  LucideMountain,
  LucideMoveRight,
  LucidePyramid,
  LucideUsers,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export const CompanyNavigationCards = () => {
  const { id: companyId } = useParams();
  return (
    <>
      <div className="flex gap-8">
        <NavigationCard>
          <Headline as="h3" variant="medium" color="foreground">
            Users
          </Headline>
          <LucideUsers />
          <Button variant="secondary" size="small" asChild>
            <Link href={`/users/${companyId}`}>
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
            <Link href={`/sites/${companyId}`}>
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
            <Link href={`/site-locations/${companyId}`}>
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
