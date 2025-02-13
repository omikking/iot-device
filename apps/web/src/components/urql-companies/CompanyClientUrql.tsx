// This file is an example on how to query GraphQL from a client component

// A component is a client component when it includes 'use client' at the top.
// A component is also rendered as a client component when it is imported to a parent component/page that has 'use client', even when itself does not contain 'use client'
// Please look into client component vs server component (RSC) in Next.js if you are unsure about the differences between the two.

// See https://commerce.nearform.com/open-source/urql/docs/basics/react-preact/ for docs
// Only difference from their example is that we use graphql-codegen for TypeScript typings, so we use import { graphql } from '@/gql'; instead of import { gql } from 'urql';
// More docs on graphql-codegen can be found in https://commerce.nearform.com/open-source/urql/docs/basics/typescript-integration/ and https://the-guild.dev/graphql/codegen/docs/guides/react-vue

'use client';

import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

type IPlan = {
  id: string;
  companyId: string;
  applicationName: string;
  // planLevel: string;
  planLevel?: 'GOLD' | 'SILVER' | 'BRONZE';
  expiringDate: Date;
};

type ICompany = {
  id: string;
  name: string;
  orgNumber: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  companyContactEmail: string;
  plans: IPlan[];
};

type ICompanyData = {
  company: ICompany;
};

const getMeCompanyDocument = graphql(`
  query getMeCompany($id: String!) {
    company(id: $id) {
      id
      name
      orgNumber
      address
      postalCode
      city
      country
      companyContactEmail

      plans {
        id
        companyId
        applicationName
        planLevel
        expiringDate
      }
    }
  }
`);

export function useCompany(id: string) {
  const skipQuery = id === 'new'; //
  const [result] = useQuery<ICompanyData>({
    query: getMeCompanyDocument,
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
