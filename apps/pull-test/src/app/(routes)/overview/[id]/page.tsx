'use client';
import {
  LucideClipboardCheck,
  LucideMoveRight,
  LucideTriangleAlert,
} from 'lucide-react';
import Link from 'next/link';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { GoBack } from '@/components/GoBack';
import { Badge, Button, Headline, NavigationCard } from '@gsp/ui';

const getHazardDetails = graphql(`
  query getHazardDetails($id: String!) {
    hazards(companyId: $id) {
      abortReason
      boltNumber
      boltType
      comment
      createdAt
      driveId
      hazardCompletedDate
      id
      image
      isHazard
      levelId
      locationId
      peakDisplacement
      peakLoad
      positionInRing
      result
      siteId
      updatedAt
      userId
    }
  }
`);

export default function Page({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  const [hazardData] = useQuery({
    query: getHazardDetails,
    variables: { id: params.id },
    pause: !params.id,
  });

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />

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
        <Link href={`http://localhost:3001/reportedhazards/${params.id}`}>
          <NavigationCard className="relative">
            <Badge
              className="absolute top-2 right-2 flex border-neutral-3 border"
              variant="neutral"
              size="small"
            >
              {hazardData.fetching
                ? 'Loading...'
                : `${hazardData.data?.hazards?.length ?? 0} active`}
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
