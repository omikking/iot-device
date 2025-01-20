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

//@TODO A better way to handle all these types/interfaces?
type IUserPermissions = {
  id: string;
  userId: string;
  companyId: string;
  role: string;
  appsAccess: string[];
};

type IUser = {
  id: string;
  email: string;
  fullName: string;
  workPlace: string;
  phoneNumber: string;
  globalRole: string;
  isGlobalVisibility: boolean;
  userPermissions: IUserPermissions[];
};

type IPlan = {
  id: string;
  companyId: string;
  applicationName: string;
  planLevel: string;
  expiringDate: string;
};

export type ICompany = {
  __typename?: string;
  id: string;
  name: string;
  orgNumber: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  companyContactEmail: string;
  plans: IPlan[];
  users: IUser[];
  sites: string[];
};

export type ICompaniesData = {
  companies: ICompany[];
};

const getMeCompaniesDocument = graphql(`
  query getMeCompanies {
    companies {
      id
      name
      orgNumber
      address
      postalCode
      city
      country
      companyContactEmail
    }
  }
`);

// Create a custom hook for fetching companies
export function useCompanies() {
  const [result] = useQuery<ICompaniesData>({
    query: getMeCompaniesDocument,
  });

  const { data, fetching, error } = result;

  // Memoize the companies data to prevent unnecessary rerenders
  const companies = useMemo(() => {
    if (!data?.companies) {
      return [];
    }
    return data.companies;
  }, [data]);

  return {
    companies,
    isLoading: fetching,
    error,
  };
}

// @Todo ask Felix about this
// optional: create a non-hook version for use in non-react contexts, maybe something like this for mobile?
// export async function fetchCompanies(client: Client) {
//   const result = await client.query(getMeCompaniesDocument, {}).toPromise();
//   if (result.error) {
//     throw result.error;
//   }
//   return result.data?.companies ?? [];
// }
