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
import CompanyCard from '../components/CompanyCard';
import SelectApp from '../components/SelectApp';

export default function Page(): JSX.Element {
  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
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

      <hr className="w-full ui-color-gold-3" />

      <ContentHolder variant="table" headlineText="Companies to administrate">
        <CompanyList />
      </ContentHolder>
    </main>

      <div className="flex gap-1">
        <SelectApp labelText={'Pull Test'} />
        <SelectApp labelText={'Pull Test'} />
      </div>
      <div className="m-sm">
        <CompanyCard
          badgeText={'active 5'}
          badgeVariant={'active'}
          buttonVariant={'golden'}
          buttonText={'+ Add new company'}
          companyName={'Vanderlay Industries'}
          iconName={'Building2'}
        />
      </div>
  );
}
