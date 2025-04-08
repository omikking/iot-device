'use client';
import { GoBack } from '@/components/GoBack';
import { Badge, Button, Headline, NavigationCard } from '@gsp/ui';
import {
  LucideClipboardCheck,
  LucideMoveRight,
  LucideTriangleAlert,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
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

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  const companyId = session?.company?.id || '';

  const [{ data: hazardData }] = useQuery({
    query: getHazardDetails,
    variables: { id: companyId },
    pause: !companyId,
  });

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />

      {session?.company.name && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {session?.company.name}
        </Badge>
      )}

      <Headline as="h1" variant="xl" color="foreground">
        Pull Test overview
      </Headline>

      <div className="flex flex-wrap gap-12 w-full justify-center">
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

      <hr className="w-full border-neutral-2 mb-4" />
    </main>
  );
}
