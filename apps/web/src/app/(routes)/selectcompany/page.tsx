'use client';
import { Button, Text, Headline } from '@gsp/ui';
import { LucideMoveRight } from 'lucide-react';
import Link from 'next/link';
import { companiesMock } from '@/app/mock/mock';

export default function Page(): JSX.Element {
  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1 overflow-y-auto">
      <Headline as="h1" variant="xl" color="foreground">
        Select Company
      </Headline>

      <div className="flex flex-col justify-around gap-2 w-[1000px] pt-20 border-t border-t-neutral-2">
        {companiesMock.map((company) => (
          <div
            key={company.id}
            className="w-full flex justify-between items-center px-6 py-4 bg-main-white"
          >
            <Text variant="medium" color="foreground">
              {company.name}
            </Text>
            <div className="flex gap-4">
              <Button size="small" variant="primary" asChild>
                <Link href={`/selectapplication`}>
                  <LucideMoveRight />
                  Select
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
