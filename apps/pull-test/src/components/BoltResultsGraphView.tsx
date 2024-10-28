import { Badge, BoltResultCard, Text } from '@gsp/ui';
import { LucideBolt, LucideGoal, LucideWeight } from 'lucide-react';
import React from 'react';

export const BoltResultsGraphView = () => {
  return (
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
  );
};
