'use client';

import { GoBack } from '@/components/GoBack';
import { CompanyForm } from './CompanyForm';

interface CompanyCreateProps {
  isAdmin: boolean;
  mode: string;
}

export function CompanyCreate({ isAdmin }: CompanyCreateProps) {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />
      <CompanyForm isAdmin={isAdmin} mode="new" />
    </main>
  );
}
