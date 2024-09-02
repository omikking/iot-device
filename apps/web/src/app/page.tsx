'use client';
import { CompanyList } from '@/components/CompanyList';
import { Headline, Button, NavigationCard, ContentHolder } from '@gsp/ui';
import {
  LucideBuilding2,
  LucideMoveRight,
  LucidePickaxe,
  LucidePlus,
} from 'lucide-react';
import Link from 'next/link';

export default function Page(): JSX.Element {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-neutral-main-white max-w-[1400px]">
      <Headline as="h1" variant="xl" color="foreground">
        Administration
      </Headline>

      <div className="flex gap-8">
        <NavigationCard>
          <Headline as="h3" variant="medium" color="foreground">
            Companies
          </Headline>
          <LucideBuilding2 />
          <Button variant="primary" size="small" asChild>
            <Link href="/company">
              <LucidePlus />
              Add new company
            </Link>
          </Button>
        </NavigationCard>

        <NavigationCard>
          <Headline as="h3" variant="medium" color="foreground">
            Technicians
          </Headline>
          <LucidePickaxe />
          <Button variant="secondary" size="small" asChild>
            <Link href="/technicians">
              <LucideMoveRight />
              View technicians
            </Link>
          </Button>
        </NavigationCard>
      </div>

      <hr className="w-full ui-color-gold-3 mb-4" />

      <ContentHolder variant="table" headlineText="Companies to administrate">
        <CompanyList />
      </ContentHolder>
    </main>
  );
}
