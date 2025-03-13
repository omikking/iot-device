'use client';

import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

type IHazard = {
  abortReason?: string;
  boltNumber: number;
  boltType: string;
  comment?: string;
  createdAt: Date;
  driveId: string;
  hazardCompletedDate: Date[];
  id: string;
  image?: string;
  isHazard: boolean;
  levelId: string;
  locationId: string;
  peakDisplacement: number[];
  peakLoad: number[];
  positionInRing: string;
  result: string;
  siteId: string;
  updatedAt: Date;
  userId: string;
};

type IHazardData = {
  hazards: IHazard[];
};

const getHazardDetails = graphql(`
  query getHazardDetails($id: String!) {
    hazards(companyId: $id) {
      abortReason
      boltNumber
      boltType
      comment
      createdAt
      driveId
      hazardCompletedDate
      id
      image
      isHazard
      levelId
      locationId
      peakDisplacement
      peakLoad
      positionInRing
      result
      siteId
      updatedAt
      userId
    }
  }
`);

export function useHazardDetails(companyId: string) {
  const [result] = useQuery<IHazardData>({
    query: getHazardDetails,
    variables: { id: companyId },
  });

  const { data, fetching, error } = result;
  const hazards = useMemo(() => data?.hazards, [data]);

  return {
    hazards,
    isLoading: fetching,
    error,
  };
}
