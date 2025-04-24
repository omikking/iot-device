'use client';
import Link from 'next/link';
import { Button, Text } from '@gsp/ui';
import { LucideMoveRight } from 'lucide-react';
import { graphql } from '@/gql';
import { useQuery } from 'urql';

const getAllCompaniesQuery = graphql(`
  query GetAllCompanies($offset: Int, $limit: Int) {
    companies(offset: $offset, limit: $limit) {
      totalRecords
      results {
        id
        name
      }
    }
  }
`);

export const SelectCompanyList = () => {
  const [{ data }] = useQuery({
    query: getAllCompaniesQuery,
    variables: {
      offset: 0,
      limit: 10,
    },
  });
  const companies = data?.companies?.results;

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
              <Link href={`/selectapplication`}>
                <LucideMoveRight />
                Select
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};
