'use client';
import Link from 'next/link';
import { Button, Text } from '@gsp/ui';
import { LucideLayoutGrid, LucideMoveRight } from 'lucide-react';
import { graphql } from '@/gql';
import { useMutation } from 'urql';

const getCompanies = graphql(`
  query getCompanies {
    companies {
      id
      name
    }
  }
`);

export const CompanyList = () => {
  const [companiesData] = useMutation(getCompanies);

  return (
    <>
      {companiesData?.data?.companies.map((company) => (
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
