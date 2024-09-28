import { Badge, Card, CardContent, Text } from '@gsp/ui';
import { LucideBolt, LucideGoal, LucideWeight } from 'lucide-react';
import React from 'react';

export const BoltResultsGraphView = () => {
  return (
    // <div className="flex flex-row flex-wrap">
    <div className="flex justify-center gap-10 py-20 flex-wrap ">
      <Card className="border-[1px] rounded-lg border-gold-primary min-w-24 max-w-80 w-full">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-10 px-20">
          <div>
            <Badge size="large" variant={'primary'}>
              182 tests
            </Badge>
          </div>
          <Text className="text-center" color={'foreground'} variant={'small'}>
            Total numbers of tests
          </Text>
          <div>
            <LucideBolt />
          </div>
        </CardContent>
      </Card>
      <Card className="border-[1px] rounded-lg border-gold-primary min-w-24 max-w-80 w-full">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-10 px-20">
          <div>
            <Badge size="large" variant={'primary'}>
              19.5 tons
            </Badge>
          </div>
          <Text className="text-center" color={'foreground'} variant={'small'}>
            Average tons
          </Text>
          <div>
            <LucideWeight />
          </div>
        </CardContent>
      </Card>
      <Card className="border-[1px] rounded-lg border-gold-primary min-w-24 max-w-80 w-full">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-10 px-20">
          <div>
            <Badge size="large" variant={'primary'}>
              94.4%
            </Badge>
          </div>
          <Text className="text-center" color={'foreground'} variant={'small'}>
            Success rate
          </Text>
          <div>
            <LucideGoal />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
