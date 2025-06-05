'use client';
import { useQuery } from 'urql';
import { Badge, Headline, NavigationCard } from '@gsp/ui';
import { GoBack } from '@/components/GoBack';
import { SandvikLogo } from 'public/SandvikLogo';
import Link from 'next/link';
import { LucideCircuitBoard } from 'lucide-react';
import { graphql } from '@/gql';

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

  const [companyResult] = useQuery({
    query: getCompanyName,
    variables: { id: companyId },
  });

  const companyName = companyResult.data?.company?.name;

  return (
    //@TODO  Fix this min-h-[calc(100vh-65px)] add that value in tailwind-config as minPageHeight or something like that
    <main className="w-full min-h-[calc(100vh-65px)] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-1 overflow-y-auto">
      <GoBack />

      {companyName && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {companyName}
        </Badge>
      )}

      <Headline as="h1" variant="xl" color="foreground">
        Select Application
      </Headline>

      <div className="flex flex-row justify-around gap-10 max-w-[1000px] pt-20 border-t border-t-neutral-2">
        <div className="flex flex-row gap-12 justify-center">
          <Link href={`http://localhost:3001/overview/${params.id}`}>
            <NavigationCard size={'medium'}>
              <Headline as="h3" variant="medium" color="foreground">
                Pull Test
              </Headline>
              <SandvikLogo />
            </NavigationCard>
          </Link>
          {/* <Link href="http://localhost:3000/designsystem">
            <NavigationCard size={'medium'}>
              <Headline as="h3" variant="medium" color="foreground">
                Ultrabolts
              </Headline>
              <SandvikLogo />
            </NavigationCard>
          </Link>
          <Link href="http://localhost:3000/designsystem">
            <NavigationCard size={'medium'}>
              <Headline as="h3" variant="medium" color="foreground">
                Cyclops
              </Headline>
              <SandvikLogo />
            </NavigationCard>
          </Link> */}
        </div>
      </div>

      <div className="flex flex-row justify-around gap-10 max-w-[1000px] w-full pt-20 border-t border-t-neutral-2">
        <div className="flex flex-row gap-12 w-full justify-center">
          <Link href="/overview">
            <NavigationCard size={'medium'}>
              <Headline as="h3" variant="medium" color="foreground">
                Management
              </Headline>
              <LucideCircuitBoard size={56} />
            </NavigationCard>
          </Link>
        </div>
      </div>
    </main>
  );
}
