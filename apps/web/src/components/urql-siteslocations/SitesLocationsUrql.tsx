import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

export type ISite = {
  id: string;
  siteName: string;
  levels: ILevel[];
};

export type ILevel = {
  id: string;
  levelName: string;
  siteId: string;
  drives: IDrive[];
};

export type IDrive = {
  id: string;
  driveName: string;
  levelId: string;
  locations: ILocation[];
};

export type ILocation = {
  id: string;
  driveId: string;
  locationName: string;
};

type ISitesData = {
  sites: ISite[];
};
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

export function useSites() {
  const [result] = useQuery<ISitesData>({
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
  const [result, reExecuteQuery] = useQuery<ISiteData>({
    query: getMeSiteLocationDocument,
    variables: { id },
  });

  const { data, fetching, error } = result;
  const site = useMemo(() => data?.site, [data]);

  const refetchSite = () => {
    if (id) {
      reExecuteQuery({ requestPolicy: 'network-only' });
    }
  };

  return { site, fetching, error, refetchSite };
}
