import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

export type ISite = {
  id: string;
  siteName: string;
  address: string;
  passCriteria: string;
  postalCode: string;
  city: string;
  country: string;
};

type ISites = {
  sites: ISite[];
};

//Added id in query for passing it in remove query
const getSitesQuery = graphql(`
  query getCompanySites {
    sites {
      id
      siteName
      address
      postalCode
      city
      country
      companyId
    }
  }
`);

export const useSites = () => {
  const [result] = useQuery<ISites>({
    query: getSitesQuery,
  });

  const { data, fetching, error } = result;

  const sites = useMemo(() => {
    if (!data?.sites) {
      return [] as ISite[];
    }
    return data.sites;
  }, [data]);

  return { sites, isLoading: fetching, error };
};
