'use client';
import { useEffect, useMemo, type JSX } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { Headline } from '@gsp/ui';
import { SelectCompanyList } from '@/components/SelectCompanyList';

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

export default function Page(): JSX.Element | null {
  const router = useRouter();
  const [{ data, fetching }] = useQuery({
    query: getAllCompaniesQuery,
    variables: {
      offset: 0,
      limit: 100,
    },
  });
  const companies = useMemo(() => data?.companies?.results || [], [data]);

  useEffect(() => {
    if (companies.length === 1) {
      router.push(`/select-application/${companies[0].id}`);
    }
  }, [companies, router]);

  if (fetching || companies.length === 1) {
    return null;
  }

  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex flex-col m-auto items-center py-24 gap-16 bg-neutral-1 overflow-y-auto">
      <Headline as="h1" variant="xl" color="foreground">
        Select Company
      </Headline>

      <div className="flex flex-col justify-around gap-2 w-[1000px] pt-20 border-t border-t-neutral-2">
        <SelectCompanyList companies={companies} />
      </div>
    </main>
  );
}
