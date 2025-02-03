import Link from 'next/link';
import { Button, Text } from '@gsp/ui';
import { LucideLayoutGrid, LucideMoveRight } from 'lucide-react';
import { useCompanies } from './urql-overview/OverviewClientUrql';
import { getCompanies } from './urql-companies/CompaniesUrql';

export const CompanyList = () => {
  const { companies } = useCompanies();

  const testCompanies = getCompanies();

  testCompanies.then((res) => console.log('testCompanies', res));

  return (
    <>
      {testCompanies.then((res) => {
        res?.map((company) => {
          console.log('company', company);
        });
      })}
      {companies.map((company) => (
        <div
          key={company.id}
          className="w-full flex justify-between items-center px-6 py-4 bg-main-white"
        >
          <Text variant="medium" color="foreground">
            {company.name}
          </Text>
          <div className="flex gap-4">
            <Button size="small" variant="primary" asChild>
              <Link href={`/company/${company.id}`}>
                {/* @TODO find a solution that works for edit view aswell */}
                {/* <Link href="/company?mode=edit"> */}
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
