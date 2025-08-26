import {
  LucideBolt,
  LucideGoal,
  LucideWeight,
  LucideSearchX,
  ClipboardList,
} from 'lucide-react';
import React from 'react';
import { BoltResult } from '@/gql/graphql';
import { Badge, BoltResultCard, Text } from '@gsp/ui';

type BoltResultsGraphViewProps = {
  boltResults?: BoltResult[];
  site?: string;
  totalCount?: number;
  averageTons?: number;
  successRate: string;
};

export const BoltResultsGraphView = ({
  boltResults,
  site,
  totalCount,
  averageTons,
  successRate,
}: BoltResultsGraphViewProps) => {
  return (
    <>
      {site && boltResults && (
        <div className="flex justify-center gap-10 py-20 flex-wrap">
          <BoltResultCard>
            <Badge variant={'primary'} size={'large'}>
              {totalCount} tests
            </Badge>
            <Text variant="medium" color="foreground">
              Total numbers of tests
            </Text>
            <LucideBolt size={28} absoluteStrokeWidth />
          </BoltResultCard>
          <BoltResultCard>
            <Badge variant={'primary'} size={'large'}>
              {averageTons} tons
            </Badge>
            <Text variant="medium" color="foreground">
              Average tons
            </Text>
            <LucideWeight size={28} absoluteStrokeWidth />
          </BoltResultCard>
          <BoltResultCard>
            <Badge variant={'primary'} size={'large'}>
              {successRate}
            </Badge>
            <Text variant="medium" color="foreground">
              Success rate
            </Text>
            <LucideGoal size={28} absoluteStrokeWidth />
          </BoltResultCard>
        </div>
      )}

      {!boltResults && (
        <div className="flex h-80 flex-col justify-center items-center gap-5">
          <Text color="foreground" variant="medium">
            {!site
              ? 'Select site to view bolt results.'
              : 'There are no bolt results found for your search.'}
          </Text>
          {!site ? (
            <ClipboardList color="gray" />
          ) : (
            <LucideSearchX color="gray" />
          )}
        </div>
      )}
    </>
  );
};
