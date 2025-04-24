'use client';
import { Headline } from '@gsp/ui';
import { SelectCompanyList } from '@/components/SelectCompanyList';

export default function Page(): JSX.Element {
  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1 overflow-y-auto">
      <Headline as="h1" variant="xl" color="foreground">
        Select Company
      </Headline>

      <div className="flex flex-col justify-around gap-2 w-[1000px] pt-20 border-t border-t-neutral-2">
        <SelectCompanyList />
      </div>
    </main>
  );
}
