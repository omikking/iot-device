'use client';

import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

type ILevel = {
  id: string;
  levelName: string;
  siteId: string;
  // boltResults: {}
  // drives: {}
  createdAt: Date;
  updatedAt: Date;
};

type ILevelData = {
  level: ILevel;
};

const getLevelDetails = graphql(`
  query getLevelDetails($id: String!) {
    level(id: $id) {
      id
      levelName
      siteId
    }
  }
`);

export function useLevelDetails(id: string) {
  const [result] = useQuery<ILevelData>({
    query: getLevelDetails,
    variables: { id },
  });

  const { data, fetching, error } = result;
  const level = useMemo(() => data?.level, [data]);

  return {
    level,
    isLoading: fetching,
    error,
  };
}
