'use client';
import React from 'react';
import { Badge, Headline } from '@gsp/ui';
import { useSession } from 'next-auth/react';

export default function Page(): JSX.Element {
  const { data: session } = useSession();

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-28 gap-16 bg-main-white">
      {session?.company.name && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {session.company.name}
        </Badge>
      )}
      <Headline as="h1" variant="xl" color="foreground">
        Sites
      </Headline>
    </main>
  );
}
