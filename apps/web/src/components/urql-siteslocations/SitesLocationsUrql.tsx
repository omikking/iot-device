import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

export interface ISite {
  id: string;
  name: string;
  levels: ILevel[];
}

export interface ILevel {
  id: string;
  levelName: string;
  siteId: string;
  drives: IDrive[];
}

export interface IDrive {
  id: string;
  driveName: string;
  locations: ILocation[];
}

export interface ILocation {
  id: string;
  driveId: string;
  locationName: string;
}

type ISiteData = {
  site: ISite;
};

const getMeSitesLocationsDocument = graphql(`
  query getMeSitesLocations {
    sites {
      id
      createdAt
      updatedAt
      siteName
      address
      postalCode
      city
      country
      companyId
    }
  }
`);

export function useSites() {
  const [result] = useQuery({
    query: getMeSitesLocationsDocument,
  });

  const { data, fetching, error } = result;
  const sites = useMemo(() => {
    if (data) {
      return data.sites;
    }
    return [];
  }, [data]);

  return { sites, fetching, error };
}

// fetch single site
const getMeSiteLocationDocument = graphql(`
  query getMeSiteLocation($id: String!) {
    site(id: $id) {
      id
      siteName
      address
      postalCode
      city
      country
      companyId
      levels {
        id
        levelName
        siteId
        drives {
          id
          driveName
          levelId
          locations {
            id
            driveId
            locationName
          }
        }
      }
    }
  }
`);

export function useSite(id: string) {
  const [result] = useQuery<ISiteData>({
    query: getMeSiteLocationDocument,
    variables: { id },
  });

  const { data, fetching, error } = result;
  const site = useMemo(() => data?.site, [data]);

  return { site, fetching, error };
}
