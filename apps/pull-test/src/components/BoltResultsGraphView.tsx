import { BoltResult } from '@/gql/graphql';
import { Badge, BoltResultCard, Text } from '@gsp/ui';
import {
  ClipboardList,
  LucideBolt,
  LucideGoal,
  LucideSearchX,
  LucideWeight,
} from 'lucide-react';
import React from 'react';

type BoltResultsGraphProps = {
  boltResults?: BoltResult[];
  site?: string;
};

export const BoltResultsGraphView = ({
  boltResults,
  site,
}: BoltResultsGraphProps) => {
  // TODO Fix propperly later
  return (
    <>
      {site && boltResults && (
        <div className="flex justify-center gap-10 py-20 flex-wrap">
          <BoltResultCard>
            <Badge variant={'primary'} size={'large'}>
              182 tests
            </Badge>
            <Text variant="medium" color="foreground">
              Total numbers of tests
            </Text>
            <LucideBolt size={28} absoluteStrokeWidth />
          </BoltResultCard>
          <BoltResultCard>
            <Badge variant={'primary'} size={'large'}>
              19.5 tons
            </Badge>
            <Text variant="medium" color="foreground">
              Average tons
            </Text>
            <LucideWeight size={28} absoluteStrokeWidth />
          </BoltResultCard>
          <BoltResultCard>
            <Badge variant={'primary'} size={'large'}>
              94.4%
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
