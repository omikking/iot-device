'use client';
import { Button, Headline, Text } from '@gsp/ui';
import { LucideMoveRight } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const redirectPath =`http://localhost:3000/selectcompany`;
  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex flex-col m-auto items-center pt-24 gap-16 bg-neutral-1 overflow-y-auto">
      <Headline as="h1" variant="xl" color="foreground">
        404
      </Headline>
      <div className="flex flex-col items-center justify-center gap-4 w-[1000px] pt-10 border-t border-t-neutral-2">
        <Headline as="h2" variant={'medium'} color={'foreground'}>
          Oops! Page not found.
        </Headline>
        <Text color={'foreground'} variant={'medium'}>
          It looks like the page you're looking for doesn't exist.
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