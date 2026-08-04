'use client';
import { CompanyList } from '@/components/CompanyList';
import { Role } from '@/gql/graphql';
import {
  Headline,
  Button,
  NavigationCard,
  ContentHolder,
  LoadingSpinner,
} from '@gsp/ui';
import {
  LucideBuilding2,
  LucideMoveRight,
  LucidePickaxe,
  LucidePlus,
  LucideUserCog,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page(): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user?.globalRole !== Role.SandvikAdmin
    ) {
      router.push('/404');
    }
  }, [session, router]);

  if (
    status === 'authenticated' &&
    session?.user?.globalRole === Role.SandvikAdmin
  ) {
    return (
      <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
        <Headline as="h1" variant="xl" color="foreground">
          Administration Portal
        </Headline>

        <div className="flex flex-wrap justify-center gap-8 w-full">
          <NavigationCard>
            <Headline as="h3" variant="medium" color="foreground">
              Companies
            </Headline>
            <LucideBuilding2 />
            <Button variant="secondary" size="small" asChild>
              <Link href="/company/new">
                <LucidePlus />
                Add new company
              </Link>
            </Button>
          </NavigationCard>

          <NavigationCard>
            <Headline as="h3" variant="medium" color="foreground">
              Administrators
            </Headline>
            <LucideUserCog />
            <Button variant="secondary" size="small" asChild>
              <Link href="/administrators">
                <LucideMoveRight />
                View administrators
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

        <hr className="w-full border-neutral-2 mb-4" />

        <ContentHolder variant="table" headlineText="Companies to administrate">
          <CompanyList />
        </ContentHolder>
      </main>
    );
  }

  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex justify-center items-center">
      <LoadingSpinner className="animate-spin" />
    </main>
  );
}
