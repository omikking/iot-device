'use client';
import { useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

type IBoltResults = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  boltNumber: number;
  boltType: string;
  peakLoad: number[];
  peakDisplacement: number[];
  positionInRing: string;
  result: string;
  isHazard: boolean;
  hazardCompletedDate: Date;
  abortReason: string;
  comment: string;
  image: string;
  siteId: string;
  levelId: string;
  driveId: string;
  locationId: string;
  userId: string;
  // companyId: string // this should be here so we can filter on the companyId
};

type IBoltResultsData = {
  boltResults: IBoltResults[];
};

// Felix: shouldnt there be a company id here as well? otherwise we will get all bolt results from all companies
const getBoltResultsDocument = graphql(`
  query getBoltResults {
    boltResults {
      id
      createdAt
      updatedAt
      boltNumber
      boltType
      peakLoad
      peakDisplacement
      positionInRing
      result
      isHazard
      hazardCompletedDate
      abortReason
      comment
      image
      siteId
      levelId
      driveId
      locationId
      userId
      # companyId
    }
  }
`);

export function useBoltResults() {
  const [result] = useQuery<IBoltResultsData>({
    query: getBoltResultsDocument,
  });

  const { data, fetching, error } = result;
  const boltResults = useMemo(() => data?.boltResults, [data]);

  return {
    boltResults,
    isLoading: fetching,
    error,
  };
}
