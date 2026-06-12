'use client';
import { Role } from '@/gql/graphql';
import {
  Headline,
  Button,
  NavigationCard,
  LoadingSpinner,
} from '@gsp/ui';
import {
  LucideEye,
  LucideShield,
  LucideGraduationCap,
  LucideMoveRight,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GoBack } from '@/components/GoBack';

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
        <GoBack />

        <Headline as="h1" variant="xl" color="foreground">
          Select Device
        </Headline>

        <div className="flex gap-8">
          <NavigationCard>
            <Headline as="h3" variant="medium" color="foreground">
              Cyclops
            </Headline>
            <LucideEye />
            <Button variant="secondary" size="small" asChild>
              <Link href="http://localhost:3002">
                <LucideMoveRight />
                Open Cyclops
              </Link>
            </Button>
          </NavigationCard>

          <NavigationCard>
            <Headline as="h3" variant="medium" color="foreground">
              Hydra
            </Headline>
            <LucideShield />
            <Button variant="secondary" size="small" asChild>
              <Link href="http://localhost:3011">
                <LucideMoveRight />
                Open Hydra
              </Link>
            </Button>
          </NavigationCard>

          <NavigationCard>
            <Headline as="h3" variant="medium" color="foreground">
              Professor
            </Headline>
            <LucideGraduationCap />
            <Button variant="secondary" size="small" asChild>
              <Link href="http://localhost:3010">
                <LucideMoveRight />
                Open Professor
              </Link>
            </Button>
          </NavigationCard>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex justify-center items-center">
      <LoadingSpinner className="animate-spin" />
    </main>
  );
}

 