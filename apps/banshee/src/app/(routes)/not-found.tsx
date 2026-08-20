'use client';

import { Button, Headline, Text } from '@gsp/ui-core';
import { LucideMoveRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  const handleGoHome = () => {
    const companyId = pathname?.split('/').filter(Boolean)[0];
    router.push(companyId ? `/${companyId}/overview` : '/');
  };
  return (
    <main className="ui-banshee-w-full ui-banshee-min-h-[calc(100vh-65px)] ui-banshee-flex ui-banshee-flex-col ui-banshee-m-auto ui-banshee-items-center ui-banshee-pt-24 ui-banshee-gap-16 ui-banshee-bg-neutral-1 ui-banshee-overflow-y-auto">
      <Headline as="h1" variant="xl" color="foreground">
        404
      </Headline>

      <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-4 ui-banshee-w-[1000px] ui-banshee-pt-10 ui-banshee-border-t ui-banshee-border-t-neutral-2">
        <Headline as="h2" variant="medium" color="foreground">
          Oops! Page not found.
        </Headline>

        <Text color="foreground" variant="medium">
          It looks like the page you're looking for doesn't exist.
        </Text>
      </div>

      <Button size="large" variant="primary" onClick={handleGoHome}>
        <LucideMoveRight />
        Go back to home page
      </Button>
    </main>
  );
}
