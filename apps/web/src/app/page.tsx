'use client';
import { useSession } from 'next-auth/react';
import Companies from '../components/Companies';
import CompanyCard from '../components/CompanyCard';

export default function Page(): JSX.Element {
  const { data: status } = useSession();
  console.log('Status from sign in page: ', status);
  return (
    <div className="mx-10">
      <main className="flex flex-col items-center justify-around p-24 ">
        <h1 className="text-md">Welcome to Ground Support Web! 🦄</h1>
        <div className="flex flex-col md:flex-row max-w-md w-full"></div>
      </main>
      <CompanyCard
        badgeText={'active 5'}
        badgeVariant={'active'}
        buttonVariant={'golden'}
        buttonText={'+ Add new company'}
        companyName={'Vanderlay Industries'}
        iconName={'Building2'}
      />
      <CompanyCard
        badgeText={'active 5'}
        badgeVariant={'active'}
        buttonVariant={'golden'}
        buttonText={'View technicians'}
        companyName={'E-Corp'}
        iconName={'HardHat'}
      />
      <Companies />
    </div>
  );
}
