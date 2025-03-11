'use client';

import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

type ILocation = {
  id: string;
  locationName: string;
  createdAt: Date;
  updatedAt: Date;
};

type ILocationData = {
  location: ILocation;
};

const getLocationDetails = graphql(`
  query getLocationDetails($id: String!) {
    location(id: $id) {
      id
      locationName
    }
  }
`);

export function useLocationDetails(id: string) {
  const [result] = useQuery<ILocationData>({
    query: getLocationDetails,
    variables: { id },
  });

  const { data, fetching, error } = result;
  const location = useMemo(() => data?.location, [data]);

  return {
    location,
    isLoading: fetching,
    error,
  };
}
