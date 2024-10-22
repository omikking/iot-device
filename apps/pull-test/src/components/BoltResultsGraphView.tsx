import { Badge, BoltResultCard, Text } from '@gsp/ui';
import { LucideBolt } from 'lucide-react';
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
          182 tests
        </Badge>

        <Text variant="medium" color="foreground">
          Total numbers of tests
        </Text>
        <LucideBolt size={28} absoluteStrokeWidth />
      </BoltResultCard>
      <BoltResultCard>
        <Badge variant={'primary'} size={'large'}>
          182 tests
        </Badge>

        <Text variant="medium" color="foreground">
          Total numbers of tests
        </Text>
        <LucideBolt size={28} absoluteStrokeWidth />
      </BoltResultCard>
    </div>
  );
};
