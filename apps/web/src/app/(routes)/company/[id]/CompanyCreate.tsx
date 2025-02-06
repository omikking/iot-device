'use client';

import { GoBack } from '@/components/GoBack';
import { CompanyForm } from './CompanyForm';
import { Headline } from '@gsp/ui';

interface CompanyCreateProps {
  isAdmin: boolean;
  mode: string;
}

export function CompanyCreate({ isAdmin }: CompanyCreateProps) {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />
      <Headline as="h1" variant="xl" color="foreground">
        {'Add Company'}
      </Headline>
      <CompanyForm isAdmin={isAdmin} mode="new" />
    </main>
  );
}
