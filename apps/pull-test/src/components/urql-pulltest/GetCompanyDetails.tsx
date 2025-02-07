'use client';

import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

type ICompany = {
  id: string;
  name: string;
  orgNumber: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  companyContactEmail: string;
};

type ICompanyData = {
  company: ICompany;
};

const getCompanyDetails = graphql(`
  query getCompanyDetails($id: String!) {
    company(id: $id) {
      id
      name
    }
  }
`);

export function useCompanyDetails(id: string) {
  const skipQuery = id === 'new'; //
  const [result] = useQuery<ICompanyData>({
    query: getCompanyDetails,
    variables: { id },
    pause: skipQuery, // skip the whole query if id === 'new'
  });

  const { data, fetching, error } = result;
  const company = useMemo(() => data?.company, [data]);

  return {
    company,
    isLoading: fetching,
    error,
    isNew: skipQuery,
  };
}
