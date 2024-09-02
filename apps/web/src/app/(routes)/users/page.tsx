'use client';
import { UsersTable } from '@/components/UsersTable';
import { Button, Headline, Badge, GoBack } from '@gsp/ui';

import { LucidePlus } from 'lucide-react';

export default function Page(): JSX.Element {
  // Only superadmin should be able to see this page

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <GoBack />

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
