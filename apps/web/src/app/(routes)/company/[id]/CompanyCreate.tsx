'use client';

import { CompanyForm } from './CompanyForm';

interface CompanyCreateProps {
  isAdmin: boolean;
}

export function CompanyCreate({ isAdmin }: CompanyCreateProps) {
  return <CompanyForm isAdmin={isAdmin} mode="new" />;
}
