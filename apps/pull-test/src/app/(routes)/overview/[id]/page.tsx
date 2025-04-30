'use client';
import { Badge, Button, Headline, NavigationCard } from '@gsp/ui';
import {
  LucideClipboardCheck,
  LucideMoveRight,
  LucideTriangleAlert,
} from 'lucide-react';
import Link from 'next/link';
import { graphql } from '@/gql';
import { useQuery } from 'urql';

const getHazardDetails = graphql(`
  query getHazardId($id: String!) {
    hazards(companyId: $id) {
      id
    }
  }
`);

const getCompanyName = graphql(`
  query getCompanyName($id: String!) {
    company(id: $id) {
      id
      name
    }
  }
`);

export default function Page({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  const companyId = params.id;

  const [{ data }] = useQuery({
    query: getCompanyName,
    variables: { id: companyId },
  });
  const companyName = data?.company?.name;

  const [{ data: hazardData }] = useQuery({
    query: getHazardDetails,
    variables: { id: companyId },
    pause: !companyId,
  });

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      {companyName && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {companyName}
        </Badge>
      )}

      <Headline as="h1" variant="xl" color="foreground">
        Pull Test overview
      </Headline>

      <div className="flex flex-wrap gap-12 w-full justify-center">
        <Link href={`/boltresults/${companyId}`}>
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
        <Link href={`/reportedhazards/${companyId}`}>
          <NavigationCard className="relative">
            <Badge
              className="absolute top-2 right-2 flex border-neutral-3 border"
              variant="neutral"
              size="small"
            >
              {`${hazardData?.hazards?.length ?? 0} active`}
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
    </main>
  );
}
