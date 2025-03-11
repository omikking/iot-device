'use client';

import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

type IDrive = {
  id: string;
  driveName: string;
  // boltResults: {}
  // locations: {}
  createdAt: Date;
  updatedAt: Date;
};

type IDriveData = {
  drive: IDrive;
};

const getDriveDetails = graphql(`
  query getDriveDetails($id: String!) {
    drive(id: $id) {
      id
      driveName
    }
  }
`);

export function useDriveDetails(id: string) {
  const [result] = useQuery<IDriveData>({
    query: getDriveDetails,
    variables: { id },
  });

  const { data, fetching, error } = result;
  const drive = useMemo(() => data?.drive, [data]);

  return {
    drive,
    isLoading: fetching,
    error,
  };
}
