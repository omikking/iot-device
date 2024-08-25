'use client';
import { UsersTable } from '@/components/UsersTable';
import { Button, Headline, Text, Anchor, Badge } from '@gsp/ui';

import { LucideMoveLeft, LucidePlus } from 'lucide-react';
import Link from 'next/link';

export default function Page(): JSX.Element {
  // Only superadmin should be able to see this page

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10"
      >
        <Link href="/company" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft size="24" />
            Go back
          </Anchor>
        </Link>
      </Text>

      <Badge variant="primary" size="large" className="absolute top-24">
        Ecorp AB
      </Badge>

      <Headline as="h1" variant="xl" color="foreground">
        Users
      </Headline>

      <div className="flex flex-col items-end gap-5">
        <Button variant="primary" size="large">
          <LucidePlus />
          Add user
        </Button>

        <UsersTable />
      </div>
    </main>
  );
}
