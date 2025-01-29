'use client';

import { GoBack } from '@/components/GoBack';
import { Badge, Button, Headline, NavigationCard } from '@gsp/ui';
import {
  LucideClipboardCheck,
  LucideMoveRight,
  LucideTriangleAlert,
} from 'lucide-react';
import Link from 'next/link';
//import { gql, useQuery } from 'urql';
import { useParams } from 'next/navigation';
import CompanyNameUrql from '@/components/urql-pulltest/GetCompanyName';

export default function Page(): JSX.Element {
  const companyParams = useParams();

  const companyId = Array.isArray(companyParams.id)
    ? companyParams.id[0]
    : companyParams.id;
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />

      {/* Render badge dynamically */}
      <Badge variant="primary" size="large" className="absolute top-24">
        <CompanyNameUrql companyId={companyId} />
      </Badge>

      <Headline as="h1" variant="xl" color="foreground">
        Pull-test overview
      </Headline>

      <div className="flex flex-wrap gap-12 w-full justify-center  border-gold-3">
        <Link href="/boltresults">
          <NavigationCard>
            <Headline as="h3" variant="medium" color="foreground">
              Bolt results
            </Headline>
            <LucideClipboardCheck size={28} />
            <Button variant="secondary" size={'small'}>
              <LucideMoveRight />
              View bolt results
            </Button>
          </NavigationCard>
        </Link>
        <Link href="/reportedhazards">
          <NavigationCard className="relative">
            <Badge
              className="absolute top-2 right-2 flex border-neutral-3 border"
              variant="neutral"
              size="small"
            >
              5 active
            </Badge>
            <Headline as="h3" variant="medium" color="foreground">
              Hazards
            </Headline>
            <LucideTriangleAlert size={28} />
            <Button variant="secondary" size={'small'}>
              <LucideMoveRight />
              View hazards
            </Button>
          </NavigationCard>
        </Link>
      </div>

      <hr className="w-full border-neutral-2 mb-4" />
    </main>
  );
}
