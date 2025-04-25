'use client';
import { Headline } from '@gsp/ui';
import { SelectCompanyList } from '@/components/SelectCompanyList';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Company {
  id: string;
  name: string;
}

interface GetAllCompaniesResponse {
  companies: {
    totalRecords: number;
    results: Company[];
  };
}

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
  const [{ data, fetching }] = useQuery<GetAllCompaniesResponse>({
    query: getAllCompaniesQuery,
    variables: {
      offset: 0,
      limit: 10,
    },
  });

  const companies = data?.companies?.results || [];

  useEffect(() => {
    if (companies.length === 1) {
      router.push('/selectapplication');
    }
  }, [companies]);

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
