'use client';

import React from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

const getCompanyName = graphql(`
  query GetCompanyName($id: String!) {
    company(id: $id) {
      name
    }
  }
`);

export function CompanyNameUrql({ companyId }: { companyId: string }) {
  const [{ data, fetching, error }] = useQuery({
    query: getCompanyName,
    variables: { id: companyId },
  });

  if (fetching) return <p>Loading...</p>;
  if (error) {
    console.error('GraphQL Error:', error);
    return <p>Error: {error.message}</p>;
  }

  return <h2>{data?.company?.name || 'Company not found'}</h2>;
}

export default CompanyNameUrql;
