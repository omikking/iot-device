import Link from 'next/link';
import { LucideLayoutGrid, LucideMoveRight } from 'lucide-react';
import { companiesMock } from '@/app/mock/mock';
import { Button, Text } from '@gsp/ui';
import { useCompanies } from './urql-overview/OverviewClientUrql';

export const CompanyList = () => {
  return (
    <>
      {/* {companiesMock.map((company) => (
        <div
          key={company.id}
          className="w-full flex justify-between items-center px-6 py-4 bg-main-white"
        >
          <Text variant="medium" color="foreground">
            {company.name}
          </Text>
          <div className="flex gap-4">
            <Button size="small" variant="primary" asChild>
              <Link href="/company">
                <LucideMoveRight />
                Administrate
              </Link>
            </Button>
            <Button size="small" variant="outline" asChild>
              <Link href="/selectapplication">
                <LucideLayoutGrid />
                View Apps
              </Link>
            </Button>
          </div>
        </div>
      ))} */}
      {useCompanies().companies.map((company) => (
        <div
          key={company.id}
          className="w-full flex justify-between items-center px-6 py-4 bg-main-white"
        >
          <Text variant="medium" color="foreground">
            {company.name}
          </Text>
          <div className="flex gap-4">
            <Button size="small" variant="primary" asChild>
              <Link href="/company">
                <LucideMoveRight />
                Administrate
              </Link>
            </Button>
            <Button size="small" variant="outline" asChild>
              <Link href="/selectapplication">
                <LucideLayoutGrid />
                View Apps
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};
