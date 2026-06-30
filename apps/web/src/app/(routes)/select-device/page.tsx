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
  LucideZap,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotFound from '@/app/not-found';
import { GoBack } from '@/components/GoBack';

function resolveDeviceAppUrl(url: string | undefined): string | null {
  const trimmed = url?.trim();
  return trimmed ? trimmed : null;
}

export default function Page(): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showNotFound, setShowNotFound] = useState(false);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user?.globalRole !== Role.SandvikAdmin
    ) {
      router.push('/404');
    }
  }, [session, router]);

  if (showNotFound) {
    return <NotFound />;
  }

  if (
    status === 'authenticated' &&
    session?.user?.globalRole === Role.SandvikAdmin
  ) {
    const cyclopsUrl = resolveDeviceAppUrl(process.env.NEXT_PUBLIC_CYCLOPS_URL);
    const hydraUrl = resolveDeviceAppUrl(process.env.NEXT_PUBLIC_HYDRA_URL);
    const professorUrl = resolveDeviceAppUrl(
      process.env.NEXT_PUBLIC_PROFESSOR_URL,
    );

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
            {cyclopsUrl ? (
              <Button variant="secondary" size="small" asChild>
                <Link href={cyclopsUrl}>
                  <LucideMoveRight />
                  Open Cyclops
                </Link>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowNotFound(true)}
              >
                <LucideMoveRight />
                Open Cyclops
              </Button>
            )}
          </NavigationCard>

          <NavigationCard>
            <Headline as="h3" variant="medium" color="foreground">
              Hydra
            </Headline>
            <LucideShield />
            {hydraUrl ? (
              <Button variant="secondary" size="small" asChild>
                <Link href={hydraUrl}>
                  <LucideMoveRight />
                  Open Hydra
                </Link>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowNotFound(true)}
              >
                <LucideMoveRight />
                Open Hydra
              </Button>
            )}
          </NavigationCard>

          <NavigationCard>
            <Headline as="h3" variant="medium" color="foreground">
              Professor
            </Headline>
            <LucideGraduationCap />
            {professorUrl ? (
              <Button variant="secondary" size="small" asChild>
                <Link href={professorUrl}>
                  <LucideMoveRight />
                  Open Professor
                </Link>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowNotFound(true)}
              >
                <LucideMoveRight />
                Open Professor
              </Button>
            )}
          </NavigationCard>

          <NavigationCard>
            <Headline as="h3" variant="medium" color="foreground">
              Optic Bolt
            </Headline>
            <LucideZap />
            <Button variant="secondary" size="small" asChild>
              <Link href="/optic-bolt">
                <LucideMoveRight />
                Open Optic Bolt
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

 