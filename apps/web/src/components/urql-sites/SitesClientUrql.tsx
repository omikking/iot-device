import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

type ISite = {
  id: string;
  siteName: string;
  address: string;
  passCriteria: string;
};

type ISites = {
  sites: ISite[];
};

const getSitesQuery = graphql(`
  query getCompanySites {
    sites {
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