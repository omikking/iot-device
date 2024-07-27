import { Text, Headline, Button, NavigationCard } from '@gsp/ui';
import {
  LucideBuilding2,
  LucideMoveRight,
  LucidePickaxe,
  LucidePlus,
} from 'lucide-react';
import Link from 'next/link';

export default function Page(): JSX.Element {
  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center pt-28 gap-16 bg-neutral-main-white">
      <Headline as="h1" variant="xl" color="foreground">
        Administration
      </Headline>

      {/* NavigationCards */}
      <div className="flex gap-8">
        <NavigationCard>
          <Headline as="h3" variant="medium" color="foreground">
            Companies
          </Headline>
          <LucideBuilding2 />
          <Button variant="primary" size="small" asChild>
            <Link href="#">
              <LucidePlus size="16" />
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
            <Link href="#">
              <LucideMoveRight size="16" />
              View technicians
            </Link>
          </Button>
        </NavigationCard>
      </div>

      <hr className="w-full ui-color-gold-3" />

      {/* CompanyList */}
      <div className="py-5">
        <Text variant="medium" color="foreground">
          CompanyList
        </Text>
      </div>
    </main>
  );
}
