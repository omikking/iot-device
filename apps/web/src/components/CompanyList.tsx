'use client';
import Link from 'next/link';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { Button, Text, LoadingSpinner } from '@gsp/ui';
import { LucideLayoutGrid, LucideMoveRight } from 'lucide-react';

const getCompaniesQuery = graphql(`
  query getCompanies {
    companies {
      results {
        id
        name
      }
    }
  }
`);

export const CompanyList = () => {
  const [{ data, fetching }] = useQuery({ query: getCompaniesQuery });
  const companies = data?.companies?.results || [];

  if (fetching) {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!fetching && companies?.length === 0) {
    return (
      <Text variant="medium" color="muted">
        No companies found
      </Text>
    );
  }

  return (
    <>
      {companies?.map((company) => (
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
                View
              </Link>
            </Button>
            <Button size="small" variant="outline" asChild>
              <Link href={`/select-application/${company.id}`}>
                <LucideLayoutGrid />
                Browse Apps
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};
