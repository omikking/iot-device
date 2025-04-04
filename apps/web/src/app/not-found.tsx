import { Button, Headline, Text } from '@gsp/ui';
import { LucideMoveRight } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1 overflow-y-auto">
      <Headline as="h1" variant="xl" color="foreground">
        404
      </Headline>
      <div className="flex flex-col items-center justify-center gap-6 w-[1000px] pt-20 border-t border-t-neutral-2">
        <Headline as="h4" color={'foreground'} variant={'medium'}>
          Oops! Page not found.
        </Headline>
        <Text color={'foreground'} variant={'small'}>
          It looks like the page you're looking for doesn't exist.
        </Text>
        <Button size="small" variant="primary" asChild>
          <Link href={`/overview`}>
            <LucideMoveRight />
            Go back to home page
          </Link>
        </Button>
      </div>
    </main>
  );
}
