'use client';
import { Role } from '@/gql/graphql';
import { Button, Headline, Text } from '@gsp/ui-core';
import { LucideMoveRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function NotFound() {
  const { data: session } = useSession();
  const globalRole = session?.user?.globalRole;
  const isAdmin = globalRole === Role.SandvikAdmin;
  const redirectPath = isAdmin
    ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/administration-portal`
    : `${process.env.NEXT_PUBLIC_PORTAL_URL}/select-company`;

  return (
    <main className="m-auto flex min-h-screen w-full flex-col items-center gap-16 bg-neutral-1 pt-24">
      <Headline as="h1" variant="xl" color="foreground">
        404
      </Headline>

      <div className="flex w-full max-w-[1000px] flex-col items-center justify-center gap-4 border-t border-t-neutral-2 pt-10">
        <Headline as="h2" variant="medium" color="foreground">
          Page not found
        </Headline>
        <Text color="foreground" variant="medium">
          The page you are looking for does not exist, or you do not have Hydra
          access for this company.
        </Text>
      </div>

      <Button size="large" variant="primary" asChild>
        <Link href={redirectPath}>
          <LucideMoveRight />
          Go back to home page
        </Link>
      </Button>
    </main>
  );
}
